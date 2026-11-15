import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { AddressEntity } from '../models/address.entity';
import { CustomerEntity } from '../models/customer.entity';
import { CustomersService } from '../customers/customers.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddressResponseDto } from '../dto/address-response.dto';
import { AddressNotFoundError } from '../common/errors/address-not-found.error';
import { CustomerNotFoundError } from '../common/errors/customer-not-found.error';
import { AddressMapper } from './address.mapper';

@Injectable()
export class AddressesService {

    constructor(
        @InjectRepository(AddressEntity)
        private readonly addressRepository: Repository<AddressEntity>,

        private readonly customersService: CustomersService,
        private readonly dataSource: DataSource) { }

    async findAll(customerId: number, userId: number): Promise<AddressResponseDto[]> {
        await this.customersService.validateOwnership(customerId, userId, true);

        const addresses = await this.addressRepository.find({
            where: {
                customerId,
                isActive: true,
            },
            order: {
                isDefault: 'DESC',
                id: 'ASC',
            },
        });

        return addresses.map(address =>
            AddressMapper.toResponseDto(address),
        );
    }

    async findOne(customerId: number, addressId: number, userId: number): Promise<AddressResponseDto> {
        this.validateAddressId(addressId);
        await this.customersService.validateOwnership(customerId, userId, true);

        const address = await this.addressRepository.findOne({
            where: {
                id: addressId,
                customerId,
                isActive: true,
            },
        });

        if (!address) {
            throw new AddressNotFoundError();
        }

        return AddressMapper.toResponseDto(address);
    }

    async create(customerId: number, dto: CreateAddressDto, userId: number): Promise<AddressResponseDto> {
        await this.customersService.validateOwnership(customerId, userId, true);

        return this.dataSource.transaction(async manager => {

            await this.lockCustomer(customerId, manager);

            const defaultAddress = await manager.findOne(AddressEntity, {
                where: {
                    customerId,
                    isDefault: true,
                    isActive: true,
                },
            });

            const isDefault =
                dto.isDefault === true || !defaultAddress;

            if (isDefault) {
                await this.clearDefaultAddress(customerId, manager);
            }

            const address = manager.create(AddressEntity, {
                customerId,
                label: dto.label?.trim() || null,
                recipientName: this.validateText(dto.recipientName),
                recipientPhone: this.validateText(dto.recipientPhone),
                street: this.validateText(dto.street),
                streetNumber: this.validateText(dto.streetNumber),
                apartment: dto.apartment?.trim() || null,
                commune: this.validateText(dto.commune),
                region: this.validateText(dto.region),
                reference: dto.reference?.trim() || null,
                isDefault,
                isActive: true,
            });

            const savedAddress = await manager.save(address);

            return AddressMapper.toResponseDto(savedAddress);
        });
    }

    async update(customerId: number, addressId: number, dto: UpdateAddressDto, userId: number): Promise<AddressResponseDto> {
        this.validateAddressId(addressId);
        await this.customersService.validateOwnership(customerId, userId, true);

        return this.dataSource.transaction(async manager => {

            await this.lockCustomer(customerId, manager);

            const address = await this.findActiveAddress(
                customerId,
                addressId,
                manager,
            );

            if (dto.label !== undefined) {
                address.label = dto.label?.trim() || null;
            }

            if (dto.recipientName !== undefined) {
                address.recipientName =
                    this.validateText(dto.recipientName);
            }

            if (dto.recipientPhone !== undefined) {
                address.recipientPhone =
                    this.validateText(dto.recipientPhone);
            }

            if (dto.street !== undefined) {
                address.street = this.validateText(dto.street);
            }

            if (dto.streetNumber !== undefined) {
                address.streetNumber =
                    this.validateText(dto.streetNumber);
            }

            if (dto.apartment !== undefined) {
                address.apartment =
                    dto.apartment?.trim() || null;
            }

            if (dto.commune !== undefined) {
                address.commune = this.validateText(dto.commune);
            }

            if (dto.region !== undefined) {
                address.region = this.validateText(dto.region);
            }

            if (dto.reference !== undefined) {
                address.reference =
                    dto.reference?.trim() || null;
            }

            address.updatedAt = new Date();

            const savedAddress = await manager.save(address);

            return AddressMapper.toResponseDto(savedAddress);
        });
    }

    async setDefault(customerId: number, addressId: number, userId: number): Promise<AddressResponseDto> {
        this.validateAddressId(addressId);
        await this.customersService.validateOwnership(customerId, userId, true);

        return this.dataSource.transaction(async manager => {

            await this.lockCustomer(customerId, manager);

            const address = await this.findActiveAddress(
                customerId,
                addressId,
                manager,
            );

            if (address.isDefault) {
                return AddressMapper.toResponseDto(address);
            }

            await this.clearDefaultAddress(customerId, manager);

            address.isDefault = true;
            address.updatedAt = new Date();

            const savedAddress = await manager.save(address);

            return AddressMapper.toResponseDto(savedAddress);
        });
    }

    async remove(customerId: number, addressId: number, userId: number): Promise<void> {
        this.validateAddressId(addressId);
        await this.customersService.validateOwnership(customerId, userId, true);

        await this.dataSource.transaction(async manager => {

            await this.lockCustomer(customerId, manager);

            const address = await this.findActiveAddress(
                customerId,
                addressId,
                manager,
            );

            const wasDefault = address.isDefault;

            address.isActive = false;
            address.isDefault = false;
            address.updatedAt = new Date();

            await manager.save(address);

            if (wasDefault) {

                const nextAddress = await manager.findOne(AddressEntity, {
                    where: {
                        customerId,
                        isActive: true,
                    },
                    order: {
                        id: 'ASC',
                    },
                });

                if (nextAddress) {

                    nextAddress.isDefault = true;
                    nextAddress.updatedAt = new Date();

                    await manager.save(nextAddress);
                }
            }
        });
    }

    private async findActiveAddress(customerId: number, addressId: number, manager: EntityManager): Promise<AddressEntity> {
        const address = await manager.findOne(AddressEntity, {
            where: {
                id: addressId,
                customerId,
                isActive: true,
            },
        });

        if (!address) {
            throw new AddressNotFoundError();
        }

        return address;
    }

    private async clearDefaultAddress(customerId: number, manager: EntityManager): Promise<void> {

        await manager.update(AddressEntity,
            {
                customerId,
                isDefault: true,
                isActive: true
            },
            {
                isDefault: false,
                updatedAt: new Date()
            },
        );
    }

    private async lockCustomer(customerId: number, manager: EntityManager): Promise<void> {

        const customer = await manager.findOne(CustomerEntity, {
            where: {
                id: customerId,
            },
            lock: {
                mode: 'pessimistic_write',
            },
        });

        if (!customer) {
            throw new CustomerNotFoundError();
        }
    }
    private validateAddressId(addressId: number): void {

        if (!Number.isInteger(addressId) || addressId <= 0) {
            throw new BadRequestException(
                'El identificador debe ser un número entero positivo.',
            );
        }
    }
    private validateText(value: string): string {

        const text = value.trim();

        if (!text) {
            throw new BadRequestException(
                'Los campos obligatorios no pueden estar vacíos.');
        }

        return text;
    }
}
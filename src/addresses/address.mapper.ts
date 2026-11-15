import { AddressEntity } from '../models/address.entity';
import { AddressResponseDto } from '../dto/address-response.dto';

export class AddressMapper {

    static toResponseDto(address: AddressEntity): AddressResponseDto {

        return {
            id: address.id,
            customerId: address.customerId,
            label: address.label,
            recipientName: address.recipientName,
            recipientPhone: address.recipientPhone,
            street: address.street,
            streetNumber: address.streetNumber,
            apartment: address.apartment,
            commune: address.commune,
            region: address.region,
            reference: address.reference,
            isDefault: address.isDefault,
            isActive: address.isActive,
            createdAt: address.createdAt,
            updatedAt: address.updatedAt,
        };
    }
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity({ name: 'addresses' })
@Index('uq_addresses_default', ['customerId'], {
    unique: true,
    where: '"is_default" = TRUE AND "is_active" = TRUE',
})
export class AddressEntity {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ name: 'customer_id' })
    customerId: number;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    label: string | null;

    @Column({ name: 'recipient_name', length: 150 })
    recipientName: string;

    @Column({ name: 'recipient_phone', length: 20 })
    recipientPhone: string;

    @Column({ length: 150 })
    street: string;

    @Column({ name: 'street_number', length: 20 })
    streetNumber: string;

    @Column({
        type: 'varchar',
        length: 30,
        nullable: true,
    })
    apartment: string | null;

    @Column({ length: 100 })
    commune: string;

    @Column({ length: 100 })
    region: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    reference: string | null;

    @Column({
        name: 'is_default',
        default: false,
    })
    isDefault: boolean;

    @Column({
        name: 'is_active',
        default: true,
    })
    isActive: boolean;

    @Column({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'NOW()',
    })
    createdAt: Date;

    @Column({
        name: 'updated_at',
        type: 'timestamptz',
        default: () => 'NOW()',
    })
    updatedAt: Date;

    @ManyToOne(() => CustomerEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'customer_id',
        foreignKeyConstraintName: 'fk_addresses_customer',
    })
    customer: CustomerEntity;
}
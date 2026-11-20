import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Check } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { AddressEntity } from './address.entity';

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PREPARING = 'PREPARING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
    DEBIT_CARD = 'DEBIT_CARD',
    CREDIT_CARD = 'CREDIT_CARD',
    BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
    REFUNDED = 'REFUNDED',
}

@Entity({ name: 'orders' })
@Check('orders_shipping_cost_check', '"shipping_cost" >= 0')
export class OrderEntity {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ name: 'customer_id' })
    customerId: number;

    @Column({ name: 'address_id' })
    addressId: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        enumName: 'order_status',
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Column({
        name: 'payment_method',
        type: 'enum',
        enum: PaymentMethod,
        enumName: 'payment_method',
    })
    paymentMethod: PaymentMethod;

    @Column({
        name: 'payment_status',
        type: 'enum',
        enum: PaymentStatus,
        enumName: 'payment_status',
        default: PaymentStatus.PENDING,
    })
    paymentStatus: PaymentStatus;

    @Column({
        name: 'shipping_cost',
        type: 'integer',
        default: 2990,
    })
    shippingCost: number;

    @Column({
        name: 'shipping_recipient_name',
        length: 150,
    })
    shippingRecipientName: string;

    @Column({
        name: 'shipping_recipient_phone',
        length: 20,
    })
    shippingRecipientPhone: string;

    @Column({
        name: 'shipping_street',
        length: 150,
    })
    shippingStreet: string;

    @Column({
        name: 'shipping_street_number',
        length: 20,
    })
    shippingStreetNumber: string;

    @Column({
        name: 'shipping_apartment',
        type: 'varchar',
        length: 30,
        nullable: true,
    })
    shippingApartment: string | null;

    @Column({
        name: 'shipping_commune',
        length: 100,
    })
    shippingCommune: string;

    @Column({
        name: 'shipping_region',
        length: 100,
    })
    shippingRegion: string;

    @Column({
        name: 'shipping_reference',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    shippingReference: string | null;

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

    @Column({
        name: 'confirmed_at',
        type: 'timestamptz',
        nullable: true,
    })
    confirmedAt: Date | null;

    @Column({
        name: 'shipped_at',
        type: 'timestamptz',
        nullable: true,
    })
    shippedAt: Date | null;

    @Column({
        name: 'delivered_at',
        type: 'timestamptz',
        nullable: true,
    })
    deliveredAt: Date | null;

    @Column({
        name: 'cancelled_at',
        type: 'timestamptz',
        nullable: true,
    })
    cancelledAt: Date | null;

    @ManyToOne(() => CustomerEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'customer_id',
        foreignKeyConstraintName: 'fk_orders_customer',
    })
    customer: CustomerEntity;

    @ManyToOne(() => AddressEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'address_id',
        foreignKeyConstraintName: 'fk_orders_address',
    })
    address: AddressEntity;
}
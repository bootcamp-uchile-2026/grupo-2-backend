import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity({ name: 'carts' })
export class CartEntity {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ name: 'customer_id', unique: true })
    customerId: number;

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

    @OneToOne(() => CustomerEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'customer_id',
        foreignKeyConstraintName: 'fk_carts_customer',
    })
    customer: CustomerEntity;
}
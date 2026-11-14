import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'favorites' })
export class FavoriteEntity {

    @PrimaryColumn({
        name: 'customer_id',
        type: 'integer',
    })
    customerId: number;

    @PrimaryColumn({
        name: 'product_id',
        type: 'integer',
    })
    productId: number;

    @Column({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'NOW()',
    })
    createdAt: Date;

    @ManyToOne(() => CustomerEntity, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'customer_id',
        foreignKeyConstraintName: 'fk_favorites_customer',
    })
    customer: CustomerEntity;

    @ManyToOne(() => ProductEntity, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'product_id',
        foreignKeyConstraintName: 'fk_favorites_product',
    })
    product: ProductEntity;
}
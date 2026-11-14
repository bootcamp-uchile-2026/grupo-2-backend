import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Check } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'cart_items' })
@Check(
    'cart_items_quantity_check',
    '"quantity" >= 1 AND "quantity" <= 3',
)
export class CartItemEntity {

    @PrimaryColumn({ name: 'cart_id', type: 'integer' })
    cartId: number;

    @PrimaryColumn({ name: 'product_id', type: 'integer' })
    productId: number;

    @Column({ type: 'integer' })
    quantity: number;

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

    @ManyToOne(() => CartEntity, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'cart_id',
        foreignKeyConstraintName: 'fk_cart_items_cart',
    })
    cart: CartEntity;

    @ManyToOne(() => ProductEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'product_id',
        foreignKeyConstraintName: 'fk_cart_items_product',
    })
    product: ProductEntity;
}
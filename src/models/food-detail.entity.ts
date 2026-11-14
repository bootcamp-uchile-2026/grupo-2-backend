import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, Check } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'food_details' })
@Check('food_details_weight_g_check', '"weight_g" > 0')
export class FoodDetailEntity {

    @PrimaryColumn({ name: 'product_id', type: 'integer' })
    productId: number;

    @Column({
        name: 'weight_g',
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    weightG: string | null;

    @Column({
        type: 'text',
        nullable: true,
    })
    ingredients: string | null;

    @Column({
        type: 'text',
        nullable: true,
    })
    allergens: string | null;

    @Column({
        name: 'expiration_date',
        type: 'date',
        nullable: true,
    })
    expirationDate: string | null;

    @OneToOne(() => ProductEntity, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'product_id',
        foreignKeyConstraintName: 'fk_food_details_product',
    })
    product: ProductEntity;
}
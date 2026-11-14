import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Check } from 'typeorm';
import { ProducerEntity } from './producer.entity';
import { CategoryEntity } from './category.entity';

@Entity({ name: 'products' })
@Check('products_price_check', '"price" > 0')
@Check('products_stock_check', '"stock" >= 0')
@Check('products_co2_avoided_check', '"co2_avoided" >= 0')
@Check(
    'chk_products_offer',
    `(
        offer_price IS NULL
        AND offer_start_at IS NULL
        AND offer_end_at IS NULL
    )
    OR
    (
        offer_price IS NOT NULL
        AND offer_start_at IS NOT NULL
        AND offer_end_at IS NOT NULL
        AND offer_price > 0
        AND offer_price < price
        AND offer_end_at > offer_start_at
    )`,
)
export class ProductEntity {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ name: 'producer_id' })
    producerId: number;

    @Column({ name: 'category_id' })
    categoryId: number;

    @Column({ length: 200 })
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'integer' })
    price: number;

    @Column({
        name: 'offer_price',
        type: 'integer',
        nullable: true,
    })
    offerPrice: number | null;

    @Column({
        name: 'offer_start_at',
        type: 'timestamptz',
        nullable: true,
    })
    offerStartAt: Date | null;

    @Column({
        name: 'offer_end_at',
        type: 'timestamptz',
        nullable: true,
    })
    offerEndAt: Date | null;

    @Column({ type: 'integer' })
    stock: number;

    @Column({
        name: 'co2_avoided',
        type: 'numeric',
        precision: 10,
        scale: 4,
    })
    co2Avoided: string;

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

    @ManyToOne(() => ProducerEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'producer_id',
        foreignKeyConstraintName: 'fk_products_producer',
    })
    producer: ProducerEntity;

    @ManyToOne(() => CategoryEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'category_id',
        foreignKeyConstraintName: 'fk_products_category',
    })
    category: CategoryEntity;
}
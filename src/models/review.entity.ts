import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Check, Unique } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'reviews' })
@Check(
    'reviews_rating_check',
    '"rating" >= 1 AND "rating" <= 5',
)
@Unique('uq_reviews_customer_product', [
    'customerId',
    'productId',
])
export class ReviewEntity {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ name: 'customer_id' })
    customerId: number;

    @Column({ name: 'product_id' })
    productId: number;

    @Column({ type: 'integer' })
    rating: number;

    @Column({
        type: 'text',
        nullable: true,
    })
    comment: string | null;

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
        foreignKeyConstraintName: 'fk_reviews_customer',
    })
    customer: CustomerEntity;

    @ManyToOne(() => ProductEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'product_id',
        foreignKeyConstraintName: 'fk_reviews_product',
    })
    product: ProductEntity;
}
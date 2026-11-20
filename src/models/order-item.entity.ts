import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Check, Unique } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'order_items' })
@Unique('uq_order_items_product', ['orderId', 'productId'])
@Check(
    'order_items_quantity_check',
    '"quantity" >= 1 AND "quantity" <= 3',
)
@Check('order_items_unit_price_check', '"unit_price" > 0')
@Check('order_items_unit_co2_avoided_check', '"unit_co2_avoided" >= 0')
@Check('order_items_unit_green_points_check', '"unit_green_points" >= 0')
@Check(
    'chk_order_items_discount',
    `green_point_discount >= 0
    AND green_point_discount <= quantity::BIGINT * unit_price`,
)
export class OrderItemEntity {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ name: 'order_id' })
    orderId: number;

    @Column({ name: 'product_id' })
    productId: number;

    @Column({ name: 'product_name', length: 200 })
    productName: string;

    @Column({
        name: 'product_description',
        type: 'text',
    })
    productDescription: string;

    @Column({
        name: 'product_size',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    productSize: string | null;

    @Column({
        name: 'product_color',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    productColor: string | null;

    @Column({
        name: 'product_material',
        type: 'varchar',
        length: 150,
        nullable: true,
    })
    productMaterial: string | null;

    @Column({ type: 'integer' })
    quantity: number;

    @Column({
        name: 'unit_price',
        type: 'integer',
    })
    unitPrice: number;

    @Column({
        name: 'unit_co2_avoided',
        type: 'numeric',
        precision: 10,
        scale: 4,
    })
    unitCo2Avoided: string;

    @Column({
        name: 'unit_green_points',
        type: 'integer',
    })
    unitGreenPoints: number;

    @Column({
        name: 'green_point_discount',
        type: 'integer',
        default: 0,
    })
    greenPointDiscount: number;

    @Column({
        name: 'is_prepared',
        default: false,
    })
    isPrepared: boolean;

    @Column({
        name: 'prepared_at',
        type: 'timestamptz',
        nullable: true,
    })
    preparedAt: Date | null;

    @ManyToOne(() => OrderEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'order_id',
        foreignKeyConstraintName: 'fk_order_items_order',
    })
    order: OrderEntity;

    @ManyToOne(() => ProductEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'product_id',
        foreignKeyConstraintName: 'fk_order_items_product',
    })
    product: ProductEntity;
}
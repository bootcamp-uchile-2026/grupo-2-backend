import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Check } from 'typeorm';
import { ReturnEntity } from './return.entity';
import { OrderItemEntity } from './order-item.entity';

@Entity({ name: 'return_items' })
@Check(
    'return_items_quantity_check',
    '"quantity" >= 1 AND "quantity" <= 3',
)
@Check(
    'return_items_refund_amount_check',
    '"refund_amount" >= 0',
)
@Check(
    'return_items_green_points_restored_check',
    '"green_points_restored" >= 0',
)
export class ReturnItemEntity {

    @PrimaryColumn({
        name: 'return_id',
        type: 'integer',
    })
    returnId: number;

    @PrimaryColumn({
        name: 'order_item_id',
        type: 'integer',
    })
    orderItemId: number;

    @Column({ type: 'integer' })
    quantity: number;

    @Column({
        name: 'refund_amount',
        type: 'integer',
        default: 0,
    })
    refundAmount: number;

    @Column({
        name: 'green_points_restored',
        type: 'integer',
        default: 0,
    })
    greenPointsRestored: number;

    @Column({ default: false })
    restock: boolean;

    @ManyToOne(() => ReturnEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'return_id',
        foreignKeyConstraintName: 'fk_return_items_return',
    })
    returnRequest: ReturnEntity;

    @ManyToOne(() => OrderItemEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'order_item_id',
        foreignKeyConstraintName: 'fk_return_items_order_item',
    })
    orderItem: OrderItemEntity;
}
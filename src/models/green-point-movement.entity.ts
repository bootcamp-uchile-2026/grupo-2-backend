import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Check, Unique, Index } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { OrderEntity } from './order.entity';
import { ReturnEntity } from './return.entity';
import { ReviewEntity } from './review.entity';

export enum GreenPointMovementType {
    WELCOME = 'WELCOME',
    PURCHASE = 'PURCHASE',
    REVIEW = 'REVIEW',
    REDEMPTION = 'REDEMPTION',
    RETURN = 'RETURN',
    REFUND = 'REFUND',
    ADJUSTMENT = 'ADJUSTMENT',
}

@Entity({ name: 'green_point_movements' })
@Check(
    'green_point_movements_points_check',
    '"points" <> 0',
)
@Check(
    'chk_green_point_movements_sign',
    `
        (type = 'WELCOME' AND points = 80)
        OR
        (type = 'REVIEW' AND points = 5)
        OR
        (
            type IN ('PURCHASE', 'REFUND')
            AND points > 0
        )
        OR
        (
            type IN ('REDEMPTION', 'RETURN')
            AND points < 0
        )
        OR
        (type = 'ADJUSTMENT')
    `,
)
@Check(
    'chk_green_point_movements_source',
    `
        (
            type IN ('WELCOME', 'ADJUSTMENT')
            AND order_id IS NULL
            AND return_id IS NULL
            AND review_id IS NULL
        )
        OR
        (
            type IN ('PURCHASE', 'REDEMPTION')
            AND order_id IS NOT NULL
            AND return_id IS NULL
            AND review_id IS NULL
        )
        OR
        (
            type = 'REVIEW'
            AND review_id IS NOT NULL
            AND order_id IS NULL
            AND return_id IS NULL
        )
        OR
        (
            type = 'RETURN'
            AND return_id IS NOT NULL
            AND order_id IS NULL
            AND review_id IS NULL
        )
        OR
        (
            type = 'REFUND'
            AND review_id IS NULL
            AND (
                (
                    order_id IS NOT NULL
                    AND return_id IS NULL
                )
                OR
                (
                    return_id IS NOT NULL
                    AND order_id IS NULL
                )
            )
        )
    `,
)
@Unique('uq_green_point_movements_order', [
    'orderId',
    'type',
])
@Unique('uq_green_point_movements_return', [
    'returnId',
    'type',
])
@Unique('uq_green_point_movements_review', [
    'reviewId',
    'type',
])
@Index('uq_green_point_movements_welcome', ['customerId'], {
    unique: true,
    where: `"type" = 'WELCOME'`,
})
export class GreenPointMovementEntity {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ name: 'customer_id' })
    customerId: number;

    @Column({
        type: 'enum',
        enum: GreenPointMovementType,
        enumName: 'green_point_movement_type',
    })
    type: GreenPointMovementType;

    @Column({ type: 'integer' })
    points: number;

    @Column({
        name: 'order_id',
        type: 'integer',
        nullable: true,
    })
    orderId: number | null;

    @Column({
        name: 'return_id',
        type: 'integer',
        nullable: true,
    })
    returnId: number | null;

    @Column({
        name: 'review_id',
        type: 'integer',
        nullable: true,
    })
    reviewId: number | null;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    description: string | null;

    @Column({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'NOW()',
    })
    createdAt: Date;

    @ManyToOne(() => CustomerEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'customer_id',
        foreignKeyConstraintName: 'fk_green_point_movements_customer',
    })
    customer: CustomerEntity;

    @ManyToOne(() => OrderEntity, {
        nullable: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'order_id',
        foreignKeyConstraintName: 'fk_green_point_movements_order',
    })
    order: OrderEntity | null;

    @ManyToOne(() => ReturnEntity, {
        nullable: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'return_id',
        foreignKeyConstraintName: 'fk_green_point_movements_return',
    })
    returnRequest: ReturnEntity | null;

    @ManyToOne(() => ReviewEntity, {
        nullable: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'review_id',
        foreignKeyConstraintName: 'fk_green_point_movements_review',
    })
    review: ReviewEntity | null;
}
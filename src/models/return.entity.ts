import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { UserEntity } from './user.entity';

export enum ReturnStatus {
    REQUESTED = 'REQUESTED',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
}

@Entity({ name: 'returns' })
export class ReturnEntity {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ name: 'order_id' })
    orderId: number;

    @Column({
        type: 'enum',
        enum: ReturnStatus,
        enumName: 'return_status',
        default: ReturnStatus.REQUESTED,
    })
    status: ReturnStatus;

    @Column({ type: 'text' })
    reason: string;

    @Column({
        name: 'admin_notes',
        type: 'text',
        nullable: true,
    })
    adminNotes: string | null;

    @Column({
        name: 'processed_by',
        type: 'integer',
        nullable: true,
    })
    processedBy: number | null;

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
        name: 'completed_at',
        type: 'timestamptz',
        nullable: true,
    })
    completedAt: Date | null;

    @ManyToOne(() => OrderEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'order_id',
        foreignKeyConstraintName: 'fk_returns_order',
    })
    order: OrderEntity;

    @ManyToOne(() => UserEntity, {
        nullable: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'processed_by',
        foreignKeyConstraintName: 'fk_returns_processed_by',
    })
    processedByUser: UserEntity | null;
}
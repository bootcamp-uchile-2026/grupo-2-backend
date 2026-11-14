import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'customers' })
export class CustomerEntity {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ name: 'user_id', unique: true })
    userId: number;

    @Column({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'NOW()',
    })
    createdAt: Date;

    @OneToOne(() => UserEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'user_id',
        foreignKeyConstraintName: 'fk_customers_user',
    })
    user: UserEntity;
}
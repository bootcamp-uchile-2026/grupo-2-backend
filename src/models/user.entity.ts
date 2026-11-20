import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FileEntity } from './file.entity';

export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    PRODUCER = 'PRODUCER',
    ADMIN = 'ADMIN',
}

@Entity({ name: 'users' })
export class UserEntity {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ name: 'password_hash', length: 255 })
    passwordHash: string;

    @Column({ name: 'first_name', length: 100 })
    firstName: string;

    @Column({
        name: 'last_name',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    lastName: string | null;

    @Column({
        type: 'varchar',
        length: 20,
        nullable: true,
    })
    phone: string | null;

    @Column({
        name: 'profile_file_id',
        type: 'uuid',
        nullable: true,
    })
    profileFileId: string | null;

    @Column({
        type: 'enum',
        enum: UserRole,
        enumName: 'user_role',
    })
    role: UserRole;

    @Column({
        name: 'is_active',
        default: true,
    })
    isActive: boolean;

    @Column({
        name: 'privacy_accepted_at',
        type: 'timestamptz',
    })
    privacyAcceptedAt: Date;

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

    @ManyToOne(() => FileEntity, {
        nullable: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'profile_file_id',
        foreignKeyConstraintName: 'fk_users_profile_file',
    })
    profileFile: FileEntity | null;
}
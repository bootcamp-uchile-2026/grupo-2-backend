import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { FileEntity } from './file.entity';

@Entity({ name: 'producers' })
export class ProducerEntity {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ name: 'user_id', unique: true })
    userId: number;

    @Column({ name: 'business_name', length: 150 })
    businessName: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string | null;

    @Column({
        name: 'logo_file_id',
        type: 'uuid',
        nullable: true,
    })
    logoFileId: string | null;

    @Column({
        name: 'banner_file_id',
        type: 'uuid',
        nullable: true,
    })
    bannerFileId: string | null;

    @Column({
        type: 'varchar',
        length: 150,
        nullable: true,
    })
    location: string | null;

    @Column({
        name: 'website_url',
        type: 'varchar',
        length: 500,
        nullable: true,
    })
    websiteUrl: string | null;

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

    @OneToOne(() => UserEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'user_id',
        foreignKeyConstraintName: 'fk_producers_user',
    })
    user: UserEntity;

    @ManyToOne(() => FileEntity, {
        nullable: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'logo_file_id',
        foreignKeyConstraintName: 'fk_producers_logo_file',
    })
    logoFile: FileEntity | null;

    @ManyToOne(() => FileEntity, {
        nullable: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'banner_file_id',
        foreignKeyConstraintName: 'fk_producers_banner_file',
    })
    bannerFile: FileEntity | null;
}
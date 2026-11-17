import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FileEntity } from './file.entity';

@Entity({ name: 'categories' })
export class CategoryEntity {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ length: 100, unique: true })
    name: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string | null;

    @Column({
        name: 'image_file_id',
        type: 'uuid',
        nullable: true,
    })
    imageFileId: string | null;

    @ManyToOne(() => FileEntity, {
        nullable: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'image_file_id',
        foreignKeyConstraintName: 'fk_categories_image_file',
    })
    imageFile: FileEntity | null;
}
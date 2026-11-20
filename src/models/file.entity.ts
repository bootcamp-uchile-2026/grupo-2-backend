import { Entity, PrimaryGeneratedColumn, Column, Check } from 'typeorm';

@Entity({ name: 'files' })
@Check('files_size_check', '"size" > 0')

export class FileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'original_name', length: 255 })
    originalName: string;

    @Column({ name: 'storage_key', length: 500, unique: true })
    storageKey: string;

    @Column({ name: 'mime_type', length: 100 })
    mimeType: string;

    @Column({ type: 'integer' })
    size: number;

    @Column({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'NOW()',
    })
    createdAt: Date;
}
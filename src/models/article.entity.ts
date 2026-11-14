import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { FileEntity } from './file.entity';

export enum ArticleStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

@Entity({ name: 'articles' })
export class ArticleEntity {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ name: 'author_id' })
    authorId: number;

    @Column({
        name: 'cover_file_id',
        type: 'uuid',
        nullable: true,
    })
    coverFileId: string | null;

    @Column({ length: 200 })
    title: string;

    @Column({
        type: 'varchar',
        length: 500,
        nullable: true,
    })
    summary: string | null;

    @Column({ type: 'text' })
    content: string;

    @Column({
        type: 'enum',
        enum: ArticleStatus,
        enumName: 'article_status',
        default: ArticleStatus.DRAFT,
    })
    status: ArticleStatus;

    @Column({
        name: 'published_at',
        type: 'timestamptz',
        nullable: true,
    })
    publishedAt: Date | null;

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

    @ManyToOne(() => UserEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'author_id',
        foreignKeyConstraintName: 'fk_articles_author',
    })
    author: UserEntity;

    @ManyToOne(() => FileEntity, {
        nullable: true,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'cover_file_id',
        foreignKeyConstraintName: 'fk_articles_cover_file',
    })
    coverFile: FileEntity | null;
}
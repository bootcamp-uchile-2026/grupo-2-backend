import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
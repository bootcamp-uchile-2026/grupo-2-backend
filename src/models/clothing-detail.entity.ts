import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'clothing_details' })
export class ClothingDetailEntity {

    @PrimaryColumn({ name: 'product_id', type: 'integer' })
    productId: number;

    @Column({
        type: 'varchar',
        length: 30,
        nullable: true,
    })
    size: string | null;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    color: string | null;

    @Column({
        type: 'varchar',
        length: 150,
        nullable: true,
    })
    material: string | null;

    @OneToOne(() => ProductEntity, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'product_id',
        foreignKeyConstraintName: 'fk_clothing_details_product',
    })
    product: ProductEntity;
}
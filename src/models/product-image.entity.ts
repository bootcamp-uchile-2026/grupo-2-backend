import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, Check, Unique, Index } from 'typeorm';
import { ProductEntity } from './product.entity';
import { FileEntity } from './file.entity';

@Entity({ name: 'product_images' })
@Check('product_images_display_order_check', '"display_order" > 0')
@Unique('uq_product_images_display_order', ['productId', 'displayOrder'])
@Index('uq_product_images_primary', ['productId'], {
    unique: true,
    where: '"is_primary" = TRUE',
})
export class ProductImageEntity {

    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column({ name: 'product_id' })
    productId: number;

    @Column({
        name: 'file_id',
        type: 'uuid',
        unique: true,
    })
    fileId: string;

    @Column({
        name: 'display_order',
        type: 'integer',
    })
    displayOrder: number;

    @Column({
        name: 'is_primary',
        default: false,
    })
    isPrimary: boolean;

    @ManyToOne(() => ProductEntity, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'product_id',
        foreignKeyConstraintName: 'fk_product_images_product',
    })
    product: ProductEntity;

    @OneToOne(() => FileEntity, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({
        name: 'file_id',
        foreignKeyConstraintName: 'fk_product_images_file',
    })
    file: FileEntity;
}
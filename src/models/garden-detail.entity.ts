import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, Check } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'garden_details' })
@Check('garden_details_height_cm_check', '"height_cm" > 0')
@Check('garden_details_width_cm_check', '"width_cm" > 0')
@Check('garden_details_depth_cm_check', '"depth_cm" > 0')
@Check('garden_details_weight_g_check', '"weight_g" > 0')
export class GardenDetailEntity {

    @PrimaryColumn({ name: 'product_id', type: 'integer' })
    productId: number;

    @Column({
        type: 'varchar',
        length: 150,
        nullable: true,
    })
    material: string | null;

    @Column({
        name: 'height_cm',
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    heightCm: string | null;

    @Column({
        name: 'width_cm',
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    widthCm: string | null;

    @Column({
        name: 'depth_cm',
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    depthCm: string | null;

    @Column({
        name: 'weight_g',
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    weightG: string | null;

    @Column({
        name: 'usage_type',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    usageType: string | null;

    @OneToOne(() => ProductEntity, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'product_id',
        foreignKeyConstraintName: 'fk_garden_details_product',
    })
    product: ProductEntity;
}
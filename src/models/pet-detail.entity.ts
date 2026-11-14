import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, Check } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'pet_details' })
@Check('pet_details_weight_g_check', '"weight_g" > 0')
export class PetDetailEntity {

    @PrimaryColumn({ name: 'product_id', type: 'integer' })
    productId: number;

    @Column({
        name: 'pet_type',
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    petType: string | null;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: true,
    })
    size: string | null;

    @Column({
        name: 'weight_g',
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    weightG: string | null;

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
        foreignKeyConstraintName: 'fk_pet_details_product',
    })
    product: ProductEntity;
}
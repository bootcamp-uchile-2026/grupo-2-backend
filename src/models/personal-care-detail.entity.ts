import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, Check, } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'personal_care_details' })
@Check('personal_care_details_volume_ml_check', '"volume_ml" > 0')
export class PersonalCareDetailEntity {

    @PrimaryColumn({ name: 'product_id', type: 'integer' })
    productId: number;

    @Column({
        name: 'volume_ml',
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    volumeMl: string | null;

    @Column({ type: 'text', nullable: true })
    ingredients: string | null;

    @Column({
        name: 'skin_type',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    skinType: string | null;

    @OneToOne(() => ProductEntity, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'product_id',
        foreignKeyConstraintName: 'fk_personal_care_details_product',
    })
    product: ProductEntity;
}
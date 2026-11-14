import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, Check } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'wellness_details' })
@Check('wellness_details_volume_ml_check', '"volume_ml" > 0')
@Check('wellness_details_duration_hours_check', '"duration_hours" > 0')
export class WellnessDetailEntity {

    @PrimaryColumn({ name: 'product_id', type: 'integer' })
    productId: number;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    fragrance: string | null;

    @Column({
        name: 'volume_ml',
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    volumeMl: string | null;

    @Column({
        name: 'duration_hours',
        type: 'numeric',
        precision: 8,
        scale: 2,
        nullable: true,
    })
    durationHours: string | null;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    format: string | null;

    @OneToOne(() => ProductEntity, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'product_id',
        foreignKeyConstraintName: 'fk_wellness_details_product',
    })
    product: ProductEntity;
}
import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, Check } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'home_cleaning_details' })
@Check('home_cleaning_details_volume_ml_check', '"volume_ml" > 0')
export class HomeCleaningDetailEntity {

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
    composition: string | null;

    @Column({
        name: 'application_surface',
        type: 'varchar',
        length: 150,
        nullable: true,
    })
    applicationSurface: string | null;

    @OneToOne(() => ProductEntity, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'product_id',
        foreignKeyConstraintName: 'fk_home_cleaning_details_product',
    })
    product: ProductEntity;
}
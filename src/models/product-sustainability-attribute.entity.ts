import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { SustainabilityAttributeEntity } from './sustainability-attribute.entity';

@Entity({ name: 'product_sustainability_attributes' })
export class ProductSustainabilityAttributeEntity {

    @PrimaryColumn({ name: 'product_id', type: 'integer' })
    productId: number;

    @PrimaryColumn({
        name: 'sustainability_attribute_id',
        type: 'integer',
    })
    sustainabilityAttributeId: number;

    @ManyToOne(() => ProductEntity, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'product_id',
        foreignKeyConstraintName: 'fk_product_sustainability_product',
    })
    product: ProductEntity;

    @ManyToOne(() => SustainabilityAttributeEntity, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'sustainability_attribute_id',
        foreignKeyConstraintName: 'fk_product_sustainability_attribute',
    })
    sustainabilityAttribute: SustainabilityAttributeEntity;
}
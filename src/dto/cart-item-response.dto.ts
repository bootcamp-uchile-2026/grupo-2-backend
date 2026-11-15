import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponseDto {

    @ApiProperty({ example: 65 })
    productId: number;

    @ApiProperty({ example: 'Miel natural' })
    name: string;

    @ApiProperty({ example: 1 })
    producerId: number;

    @ApiProperty({ example: 'EcoRaíz' })
    producerName: string;

    @ApiProperty({
        type: String,
        nullable: true,
        example: null})
    primaryImageFileId: string | null;

    @ApiProperty({ example: 5000 })
    price: number;

    @ApiProperty({
        type: Number,
        nullable: true,
        example: 4500,
    })
    offerPrice: number | null;

    @ApiProperty({ example: 4500 })
    finalPrice: number;

    @ApiProperty({ example: 10 })
    discountPercentage: number;

    @ApiProperty({ example: 2 })
    quantity: number;

    @ApiProperty({ example: 19 })
    stock: number;

    @ApiProperty({
        description: 'Indica si el producto y la cantidad solicitada están disponibles.',
        example: true})
    available: boolean;

    @ApiProperty({ example: 9000 })
    subtotal: number;

    @ApiProperty({
        description: 'Kilogramos de CO2 evitados por unidad.',
        example: 3.05})
    unitCo2Avoided: number;

    @ApiProperty({
        description: 'Puntos verdes por unidad.',
        example: 305})
    unitGreenPoints: number;

    @ApiProperty({
        description: 'CO2 evitado considerando la cantidad.',
        example: 6.1,
    })
    co2Avoided: number;

    @ApiProperty({
        description: 'Puntos verdes considerando la cantidad.',
        example: 610,
    })
    greenPoints: number;
}
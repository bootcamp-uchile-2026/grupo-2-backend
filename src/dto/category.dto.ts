import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {

    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Alimentos' })
    name: string;

    @ApiProperty({
        example: 'Productos alimenticios artesanales y sustentables.',
        type: String,
        nullable: true,
    })
    description: string | null;

    @ApiProperty({
        type: String,
        format: 'uuid',
        nullable: true,
    })
    imageFileId: string | null;
}
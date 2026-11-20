import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {

    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ example: '/public/productos/2026/11/imagen.jpg' })
    url: string;

    @ApiProperty({ example: 'image/jpeg' })
    mimeType: string;
}
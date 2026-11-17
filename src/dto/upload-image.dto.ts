import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Imagen en formato JPEG, PNG o WebP. Máximo 5 MiB.'
    })
    file: any;
}
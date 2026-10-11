import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "node_modules/@nestjs/swagger/dist/decorators/api-property.decorator";

export class CreateCustomerDto {

    @ApiProperty({ example: 'cliente@correo.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'clave1234' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    constructor() {}

}

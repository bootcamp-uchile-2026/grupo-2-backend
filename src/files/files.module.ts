import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';
import { FileEntity } from '../models/file.entity';
import { FilesService } from './files.service';
import { ImagesStorage } from './images.storage';
import { FilesController } from './files.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([FileEntity]),
        ServeStaticModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => [{
                rootPath: resolve(configService.getOrThrow<string>('BASE_ARCHIVOS'), 'productos'),
                serveRoot: '/public/productos',
                serveStaticOptions: {
                    index: false,
                    redirect: false,
                    dotfiles: 'deny',
                },
            }],
        }),
    ],
    controllers: [FilesController],
    providers: [FilesService, ImagesStorage],
    exports: [FilesService],
})
export class FilesModule { }
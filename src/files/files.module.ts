import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';
import { FileEntity } from '../models/file.entity';
import { UserEntity } from '../models/user.entity';
import { ArticleEntity } from '../models/article.entity';
import { FilesService } from './files.service';
import { ImagesStorage } from './images.storage';
import { FilesController } from './files.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([FileEntity, UserEntity, ArticleEntity]),
        ServeStaticModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ['productos', 'logos', 'banners', 'categorias'].map(domain => ({
                rootPath: resolve(configService.getOrThrow<string>('BASE_ARCHIVOS'), domain),
                serveRoot: `/public/${domain}`,
                serveStaticOptions: {
                    index: false,
                    redirect: false,
                    dotfiles: 'deny' as const,
                },
            })),
        }),
    ],
    controllers: [FilesController],
    providers: [FilesService, ImagesStorage],
    exports: [FilesService],
})
export class FilesModule { }
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../models/file.entity';
import { FilesService } from './files.service';
import { ImagesStorage } from './images.storage';

@Module({
    imports: [TypeOrmModule.forFeature([FileEntity])],
    providers: [FilesService, ImagesStorage],
    exports: [FilesService],
})
export class FilesModule { }
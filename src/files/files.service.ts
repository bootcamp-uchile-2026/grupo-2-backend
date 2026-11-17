import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from '../models/file.entity';
import { ImagesStorage } from './images.storage';

@Injectable()
export class FilesService {

    private readonly logger = new Logger(FilesService.name);

    constructor(
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,
        private readonly imagesStorage: ImagesStorage,
    ) { }

    async saveImage(archivo: Express.Multer.File, domain: 'productos' | 'perfiles' | 'logos' | 'banners' | 'articulos'): Promise<FileEntity> {
        let storageKey: string | undefined;

        try {
            storageKey = await this.imagesStorage.saveImage(archivo, domain);

            const file = this.fileRepository.create({
                originalName: archivo.originalname,
                storageKey,
                mimeType: archivo.mimetype,
                size: archivo.size,
            });

            return await this.fileRepository.save(file);

        } catch (error) {
            if (storageKey) {
                try {
                    await this.imagesStorage.deleteImage(storageKey);
                } catch (cleanupError) {
                    this.logger.error(`No se pudo eliminar el archivo ${storageKey}`, cleanupError);
                }
            }

            this.logger.error('Error al almacenar la imagen', error);
            throw new InternalServerErrorException('No se pudo almacenar la imagen');
        }
    }
}
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { FileEntity } from '../models/file.entity';
import { ImagesStorage } from './images.storage';

@Injectable()
export class FilesService {

    private readonly logger = new Logger(FilesService.name);

    constructor(private readonly imagesStorage: ImagesStorage) { }

    async saveImage(archivo: Express.Multer.File, domain: 'productos' | 'perfiles' | 'logos' | 'banners' | 'articulos', manager: EntityManager): Promise<FileEntity> {
        let storageKey: string | undefined;

        try {
            storageKey = await this.imagesStorage.saveImage(archivo, domain);

            const file = manager.create(FileEntity, {
                originalName: archivo.originalname,
                storageKey,
                mimeType: archivo.mimetype,
                size: archivo.size,
            });

            return await manager.save(file);

        } catch (error) {
            if (storageKey) {
                await this.deletePhysicalImage(storageKey);
            }

            this.logger.error('Error al almacenar la imagen', error);
            throw new InternalServerErrorException('No se pudo almacenar la imagen');
        }
    }

    async deletePhysicalImage(storageKey: string): Promise<void> {
        try {
            await this.imagesStorage.deleteImage(storageKey);
        } catch (error) {
            this.logger.error(`No se pudo eliminar el archivo ${storageKey}`, error);
        }
    }
}
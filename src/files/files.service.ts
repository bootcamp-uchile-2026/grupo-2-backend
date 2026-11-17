import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { FileEntity } from '../models/file.entity';
import { ImagesStorage } from './images.storage';
import { FileResponseDto } from '../dto/file-response.dto';

@Injectable()
export class FilesService {

    private readonly logger = new Logger(FilesService.name);

    constructor(
        private readonly imagesStorage: ImagesStorage,
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,
    ) { }

    async findPublicFile(fileId: string): Promise<FileResponseDto> {

        const file = await this.fileRepository.findOne({
            where: { id: fileId },
        });

        if (!file || !file.storageKey.startsWith('productos/')) {
            throw new NotFoundException('Imagen no encontrada.');
        }

        return {
            id: file.id,
            url: `/public/${file.storageKey}`,
            mimeType: file.mimeType,
        };
    }

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
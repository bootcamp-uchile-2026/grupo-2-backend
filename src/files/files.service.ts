import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, LessThanOrEqual } from 'typeorm';
import { FileEntity } from '../models/file.entity';
import { ImagesStorage } from './images.storage';
import { FileResponseDto } from '../dto/file-response.dto';
import { UserEntity, UserRole } from '../models/user.entity';
import { ArticleEntity, ArticleStatus } from '../models/article.entity';

@Injectable()
export class FilesService {

    private readonly logger = new Logger(FilesService.name);

    constructor(
        private readonly imagesStorage: ImagesStorage,

        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
    ) { }

    validateImage(archivo: Express.Multer.File): void {

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(archivo.mimetype)) {
            throw new BadRequestException('Formato de imagen no permitido.');
        }

        if (archivo.size <= 0 || archivo.size > 5 * 1024 * 1024 || archivo.originalname.length > 255) {
            throw new BadRequestException('Tamaño o nombre de archivo inválido.');
        }
    }

    async findPublicFile(fileId: string): Promise<FileResponseDto> {

        const file = await this.findExistingFile(fileId);
        const domain = file.storageKey.split('/')[0];

        if (['productos', 'logos', 'banners', 'categorias'].includes(domain)) {
            return {
                id: file.id,
                url: `/public/${file.storageKey}`,
                mimeType: file.mimeType,
            };
        }

        if (domain === 'articulos') {

            await this.validatePublishedCover(file.id);

            return {
                id: file.id,
                url: `/files/${file.id}/content`,
                mimeType: file.mimeType,
            };
        }

        throw new NotFoundException('Imagen no encontrada.');
    }

    private async findExistingFile(fileId: string): Promise<FileEntity> {

        const file = await this.fileRepository.findOne({
            where: { id: fileId },
        });

        if (!file || !await this.imagesStorage.existsImage(file.storageKey)) {
            throw new NotFoundException('Imagen no encontrada.');
        }

        return file;
    }

    private async validatePublishedCover(fileId: string): Promise<void> {

        const article = await this.articleRepository.findOne({
            where: {
                coverFileId: fileId,
                status: ArticleStatus.PUBLISHED,
                publishedAt: LessThanOrEqual(new Date()),
            },
        });

        if (!article) {
            throw new NotFoundException('Imagen no encontrada.');
        }
    }

    async readPublicContent(fileId: string) {

        const file = await this.findExistingFile(fileId);

        if (!file.storageKey.startsWith('articulos/')) {
            throw new NotFoundException('Imagen no encontrada.');
        }

        await this.validatePublishedCover(file.id);

        return {
            content: await this.imagesStorage.readImage(file.storageKey),
            mimeType: file.mimeType,
        };
    }

    async readPrivateContent(fileId: string, userId: number, role: UserRole) {

        const file = await this.findExistingFile(fileId);
        const domain = file.storageKey.split('/')[0];

        if (domain === 'perfiles') {

            const user = await this.userRepository.findOne({
                where: { id: userId, profileFileId: file.id, isActive: true },
            });

            if (!user) {
                throw new NotFoundException('Imagen no encontrada.');
            }

        } else if (domain === 'articulos' && role === UserRole.ADMIN) {

            const article = await this.articleRepository.findOne({
                where: { coverFileId: file.id },
            });

            if (!article) {
                throw new NotFoundException('Imagen no encontrada.');
            }

        } else {
            throw new NotFoundException('Imagen no encontrada.');
        }

        return {
            content: await this.imagesStorage.readImage(file.storageKey),
            mimeType: file.mimeType,
        };
    }

    async saveImage(archivo: Express.Multer.File, domain: 'productos' | 'perfiles' | 'logos' | 'banners' | 'articulos' | 'categorias', manager: EntityManager): Promise<FileEntity> {

        this.validateImage(archivo);
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
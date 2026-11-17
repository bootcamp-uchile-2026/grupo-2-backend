import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

@Injectable()
export class ImagesStorage {

    constructor(private readonly configService: ConfigService) { }

    async saveImage(archivo: Express.Multer.File, domain: 'productos' | 'perfiles' | 'logos' | 'banners' | 'articulos' | 'categorias'): Promise<string> {
        const baseArchivos = resolve(this.configService.getOrThrow<string>('BASE_ARCHIVOS'));

        const extensions: Record<string, string> = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp',
        };

        const extension = extensions[archivo.mimetype];

        if (!extension) {
            throw new Error('Formato de imagen no permitido');
        }

        const fecha = new Date();
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');

        const nombreArchivo = `${randomUUID()}${extension}`;
        const storageKey = `${domain}/${anio}/${mes}/${nombreArchivo}`;
        const rutaArchivo = join(baseArchivos, storageKey);

        await fs.mkdir(dirname(rutaArchivo), { recursive: true });
        await fs.writeFile(rutaArchivo, archivo.buffer, { flag: 'wx' });

        return storageKey;
    }

    async readImage(storageKey: string): Promise<Buffer> {

        const baseArchivos = resolve(this.configService.getOrThrow<string>('BASE_ARCHIVOS'));

        try {
            return await fs.readFile(join(baseArchivos, storageKey));
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new NotFoundException('Imagen no encontrada.');
            }

            throw error;
        }
    }

    async existsImage(storageKey: string): Promise<boolean> {
        const baseArchivos = resolve(this.configService.getOrThrow<string>('BASE_ARCHIVOS'));

        try {
            const archivo = await fs.stat(join(baseArchivos, storageKey));
            return archivo.isFile();
        } catch (error) {
            if (error.code === 'ENOENT') {
                return false;
            }

            throw error;
        }
    }

    async deleteImage(storageKey: string): Promise<void> {
        const baseArchivos = resolve(this.configService.getOrThrow<string>('BASE_ARCHIVOS'));
        await fs.rm(join(baseArchivos, storageKey), { force: true });
    }
}
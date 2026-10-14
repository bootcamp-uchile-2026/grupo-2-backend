import { Injectable } from '@nestjs/common';
import { CategoryNotFoundError } from '../common/errors/category-not-found.error';
import { Category } from '../models/category.model';
import { CategoryDto } from '../dto/category.dto';

@Injectable()
export class CategoriesService {

    private readonly categories: Category[] = [
        { id: 1, name: 'Alimentos', slug: 'alimentos' },
        { id: 2, name: 'Cuidado personal', slug: 'cuidado-personal' },
        { id: 3, name: 'Huerto y jardinería', slug: 'huerto-jardineria' },
        { id: 4, name: 'Limpieza del hogar', slug: 'limpieza-hogar' },
        { id: 5, name: 'Aromas y bienestar', slug: 'aromas-bienestar' },
        { id: 6, name: 'Ropa y accesorios', slug: 'ropa-accesorios' },
        { id: 7, name: 'Mascotas', slug: 'mascotas' },
        { id: 8, name: 'Decoración y artesanías', slug: 'decoracion-artesanias' },
    ];

    findAll(): CategoryDto[] {
        return this.categories.map((category) => ({ ...category }));
    }

    findOne(categoryId: number): CategoryDto {
        const category = this.categories.find((item) => item.id === categoryId);

        if (!category) {
            throw new CategoryNotFoundError();
        }

        return { ...category };
    }
}
import { Injectable } from '@nestjs/common';
import { Entrepreneur } from '../models/entrepreneur.model';
import { EntrepreneurSummaryDto } from '../dto/entrepreneur-summary.dto';
import { EntrepreneurDetailDto } from '../dto/entrepreneur-detail.dto';
import { ProductSummaryDto } from '../dto/product-summary.dto';
import { ProductsService } from '../productos/productos.service';
import { EntrepreneurNotFoundError } from '../common/errors/entrepreneur-not-found.error';

@Injectable()
export class EntrepreneursService {

  constructor(private readonly productsService: ProductsService) {}

  private readonly entrepreneurs: Entrepreneur[] = [
    {
      id: 1,
      name: 'EcoRaíz',
      description:
        'Emprendimiento dedicado a la elaboración de productos sustentables.',
      imageUrl: 'https:ecoraiz.jpg',
      story:
        'EcoRaíz nació con el objetivo de crear alternativas sustentables para el uso cotidiano.',
    },
    {
      id: 2,
      name: 'Verde Hogar',
      description:
        'Emprendimiento enfocado en productos ecológicos para el hogar.',
      imageUrl: 'https:verdehogar.jpg',
      story:
        'Verde Hogar surge como una iniciativa familiar orientada a reducir el uso de productos desechables.',
    },
    {
      id: 3,
      name: 'Naturaleza Viva',
      description:
        'Emprendimiento dedicado al bienestar y cuidado personal sustentable.',
      imageUrl: 'https:naturaleza.jpg',
      story:
        'Naturaleza Viva desarrolla productos de cuidado personal utilizando materiales y procesos de bajo impacto ambiental.',
    },
    {
      id: 4,
      name: 'Sabores de la Tierra',
      description:
        'Emprendimiento dedicado a alimentos artesanales y productos naturales.',
      imageUrl: 'imagen-dummy-sabores-tierra',
      story:
        'Sabores de la Tierra promueve la producción local de alimentos artesanales, utilizando ingredientes de origen natural.',
    },
    {
      id: 5,
      name: 'Huerto Vivo',
      description:
        'Emprendimiento especializado en huertos urbanos y jardinería sustentable.',
      imageUrl: 'imagen-dummy-huerto-vivo',
      story:
        'Huerto Vivo busca acercar el cultivo de plantas y alimentos a los hogares mediante soluciones de jardinería de bajo impacto ambiental.',
    },
    {
      id: 6,
      name: 'Aromas del Bosque',
      description:
        'Emprendimiento dedicado a productos naturales de aromaterapia y bienestar.',
      imageUrl: 'imagen-dummy-aromas-bosque',
      story:
        'Aromas del Bosque elabora productos inspirados en la naturaleza, orientados al bienestar y la relajación.',
    },
    {
      id: 7,
      name: 'Patitas Verdes',
      description:
        'Emprendimiento de accesorios y artículos sustentables para mascotas.',
      imageUrl: 'imagen-dummy-patitas-verdes',
      story:
        'Patitas Verdes desarrolla alternativas reutilizables y de menor impacto ambiental para el cuidado de las mascotas.',
    },
    {
      id: 8,
      name: 'Arte Circular',
      description:
        'Emprendimiento de decoración y artesanías elaboradas con materiales reutilizados.',
      imageUrl: 'imagen-dummy-arte-circular',
      story:
        'Arte Circular transforma materiales recuperados en objetos decorativos y piezas artesanales, promoviendo la reutilización y el consumo responsable.',
    },
  ];

  findAll(quantity?: number): EntrepreneurSummaryDto[] {
    const selectedEntrepreneurs =
      quantity === undefined
        ? this.entrepreneurs
        : this.entrepreneurs.slice(0, quantity);

    return selectedEntrepreneurs.map((entrepreneur) => ({
      id: entrepreneur.id,
      name: entrepreneur.name,
      description: entrepreneur.description,
      imageUrl: entrepreneur.imageUrl,
    }));
  }

  findOne(entrepreneurId: number): EntrepreneurDetailDto {
    const entrepreneur = this.entrepreneurs.find(
      (item) => item.id === entrepreneurId,
    );

    if (!entrepreneur) {
      throw new EntrepreneurNotFoundError();
    }

    return {
      id: entrepreneur.id,
      name: entrepreneur.name,
      description: entrepreneur.description,
      imageUrl: entrepreneur.imageUrl,
      story: entrepreneur.story,
    };
  }

  findProductsByEntrepreneur(entrepreneurId: number): ProductSummaryDto[] {
    const entrepreneur = this.entrepreneurs.find(
      (item) => item.id === entrepreneurId,
    );

    if (!entrepreneur) {
      throw new EntrepreneurNotFoundError();
    }

    return this.productsService.findProductsByEntrepreneur(
      entrepreneurId,
    );
  }
}

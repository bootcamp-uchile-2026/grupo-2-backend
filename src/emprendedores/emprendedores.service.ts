import { Injectable } from '@nestjs/common';
import { Entrepreneur } from '../model/entrepreneur.model';
import { EntrepreneurSummaryDto } from '../model/dtos/entrepreneur-summary.dto';
import { EntrepreneurDetailDto } from '../model/dtos/entrepreneur-detail.dto';
import { ProductSummaryDto } from '../model/dtos/product-summary.dto';
import { ProductosService } from '../productos/productos.service';
import { EntrepreneurNotFoundError } from '../common/errors/entrepreneur-not-found.error';

@Injectable()
export class EmprendedoresService {
  
  constructor(private readonly productosService: ProductosService) {}

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

    return this.productosService.findProductsByEntrepreneur(
      entrepreneurId,
    );
  }
}

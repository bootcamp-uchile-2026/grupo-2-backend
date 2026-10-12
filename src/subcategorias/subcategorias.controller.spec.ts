import { Test, TestingModule } from '@nestjs/testing';
import { SubcategoriesController } from './subcategorias.controller';

describe('SubcategoriesController', () => {
  let controller: SubcategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubcategoriesController],
    }).compile();

    controller = module.get<SubcategoriesController>(SubcategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

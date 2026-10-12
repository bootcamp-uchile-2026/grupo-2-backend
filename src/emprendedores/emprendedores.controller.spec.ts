import { Test, TestingModule } from '@nestjs/testing';
import { EntrepreneursController } from './emprendedores.controller';

describe('EntrepreneursController', () => {
  let controller: EntrepreneursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntrepreneursController],
    }).compile();

    controller = module.get<EntrepreneursController>(EntrepreneursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

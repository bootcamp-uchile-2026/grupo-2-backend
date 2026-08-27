import { Test, TestingModule } from '@nestjs/testing';
import { EmprendedoresController } from './emprendedores.controller';

describe('EmprendedoresController', () => {
  let controller: EmprendedoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmprendedoresController],
    }).compile();

    controller = module.get<EmprendedoresController>(EmprendedoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

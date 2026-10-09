import { Test, TestingModule } from '@nestjs/testing';
import { ReservasController } from './reservas.controller.js';
import { ReservasService } from './reservas.service.js';

describe('ReservasController', () => {
  let controller: ReservasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservasController],
      providers: [ReservasService],
    }).compile();

    controller = module.get<ReservasController>(ReservasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

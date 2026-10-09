import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ReservasModule } from './reservas/reservas.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, ReservasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
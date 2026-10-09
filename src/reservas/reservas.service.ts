import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateReservaDto } from './dto/create-reserva.dto.js';
import { UpdateReservaDto } from './dto/update-reserva.dto.js';

@Injectable()
export class ReservasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createReservaDto: CreateReservaDto) {
    return this.prisma.reserva.create({
      data: {
        clienteId: createReservaDto.clienteId,
        veiculoId: createReservaDto.veiculoId,
        dataInicio: new Date(createReservaDto.dataInicio),
        dataFim: new Date(createReservaDto.dataFim),
        valorTotal: createReservaDto.valorTotal,
        status: createReservaDto.status,
      },
    });
  }
  findAll() {
  return this.prisma.reserva.findMany();
}

findOne(id: number) {
  return this.prisma.reserva.findUnique({
    where: { id },
  });
}
update(id: number, updateReservaDto: UpdateReservaDto) {
  return this.prisma.reserva.update({
    where: { id },
    data: {
      clienteId: updateReservaDto.clienteId,
      veiculoId: updateReservaDto.veiculoId,
      dataInicio: updateReservaDto.dataInicio
        ? new Date(updateReservaDto.dataInicio)
        : undefined,
      dataFim: updateReservaDto.dataFim
        ? new Date(updateReservaDto.dataFim)
        : undefined,
      valorTotal: updateReservaDto.valorTotal,
      status: updateReservaDto.status,
    },
  });
}

remove(id: number) {
  return this.prisma.reserva.delete({
    where: { id },
  });
}
}
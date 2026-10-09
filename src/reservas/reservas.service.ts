
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateReservaDto } from './dto/create-reserva.dto.js';
import { UpdateReservaDto } from './dto/update-reserva.dto.js';
import { StatusReserva } from './enums/status-reserva.enum.js';

@Injectable()
export class ReservasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createReservaDto: CreateReservaDto) {
    const agora = new Date();

    return this.prisma.reserva.create({
      data: {
        usuario_id: BigInt(createReservaDto.usuarioId),
        reserva_veiculo_id: BigInt(createReservaDto.veiculoId),
        reserva_retirada_prevista: new Date(
          createReservaDto.retiradaPrevista,
        ),
        reserva_devolucao_prevista: new Date(
          createReservaDto.devolucaoPrevista,
        ),
        reserva_valor_estimado: createReservaDto.valorEstimado,
        reserva_status: StatusReserva.PENDENTE,
        reserva_criada: agora,
        reserva_atualizada: agora,
      },
    });
  }

  findAll() {
    return this.prisma.reserva.findMany();
  }

  findOne(id: number) {
    return this.prisma.reserva.findUnique({
      where: { reserva_id: BigInt(id) },
    });
  }

  update(id: number, updateReservaDto: UpdateReservaDto) {
    return this.prisma.reserva.update({
      where: { reserva_id: BigInt(id) },
      data: {
        usuario_id:
          updateReservaDto.usuarioId !== undefined
            ? BigInt(updateReservaDto.usuarioId)
            : undefined,

        reserva_veiculo_id:
          updateReservaDto.veiculoId !== undefined
            ? BigInt(updateReservaDto.veiculoId)
            : undefined,

        reserva_retirada_prevista: updateReservaDto.retiradaPrevista
          ? new Date(updateReservaDto.retiradaPrevista)
          : undefined,

        reserva_devolucao_prevista: updateReservaDto.devolucaoPrevista
          ? new Date(updateReservaDto.devolucaoPrevista)
          : undefined,

        reserva_valor_estimado: updateReservaDto.valorEstimado,
        reserva_status: StatusReserva.PENDENTE,
        reserva_atualizada: new Date(),
      },
    });
  }

  
async remove(id: number) {
  const reserva = await this.prisma.reserva.findUnique({
    where: { reserva_id: BigInt(id) },
  });

  if (!reserva) {
    throw new NotFoundException(
      `Reserva com ID ${id} não encontrada`,
    );
  }

  if (reserva.reserva_status === StatusReserva.CANCELADA) {
    throw new BadRequestException(
      'Esta reserva já está cancelada',
    );
  }

  if (reserva.reserva_status === StatusReserva.CONCLUIDA) {
    throw new BadRequestException(
      'Não é possível cancelar uma reserva concluída',
    );
  }

  return this.prisma.reserva.update({
    where: { reserva_id: BigInt(id) },
    data: {
      reserva_status: StatusReserva.CANCELADA,
      reserva_cancelada: new Date(),
      reserva_atualizada: new Date(),
    },
  });
}

}

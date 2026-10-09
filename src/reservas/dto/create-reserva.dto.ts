import {
  IsInt,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateReservaDto {
  @IsInt()
  clienteId: number;

  @IsInt()
  veiculoId: number;

  @IsDateString()
  dataInicio: string;

  @IsDateString()
  dataFim: string;

  @IsOptional()
  @IsNumber()
  valorTotal?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
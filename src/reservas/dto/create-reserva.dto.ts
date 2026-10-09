import {
  IsInt,
  IsOptional,
  IsNumber,
  IsDateString,
  IsPositive,
} from 'class-validator';


export class CreateReservaDto {
  @IsInt()
  @IsPositive()
  usuarioId: number;

  @IsInt()
  @IsPositive()
  veiculoId: number;

  @IsDateString()
  retiradaPrevista: string;

  @IsDateString()
  devolucaoPrevista: string;

  @IsOptional()
  @IsNumber()
  valorEstimado?: number;

  
}
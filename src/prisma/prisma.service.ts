
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const host = process.env.DB_URL;
    const usuario = process.env.DB_USUARIO;
    const senha = process.env.DB_USUARIO_SENHA;
    const banco = process.env.RESERVA;

    let databaseUrl = process.env.DATABASE_URL;

    if (host && usuario && senha && banco) {
      databaseUrl =
        `mysql://${encodeURIComponent(usuario)}:${encodeURIComponent(senha)}` +
        `@${host}:3306/${encodeURIComponent(banco)}`;
    }

    if (!databaseUrl) {
      throw new Error('Configuração do banco de dados não encontrada');
    }

    const adapter = new PrismaMariaDb(databaseUrl);

    super({ adapter });
  }
}

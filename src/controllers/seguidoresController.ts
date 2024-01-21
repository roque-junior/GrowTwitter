// seguidoresController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seguirUsuario = async (req: Request, res: Response) => {
  try {
    const { seguidorId, usuarioSeguidoId } = req.body;

    if (seguidorId === usuarioSeguidoId) {
      return res.status(400).json({ error: 'Você não pode seguir a si mesmo.' });
    }

    // Verifica se o usuário seguido existe
    const usuarioSeguido = await prisma.usuario.findUnique({
      where: { id: usuarioSeguidoId },
    });

    if (!usuarioSeguido) {
      return res.status(404).json({ error: 'Usuário seguido não encontrado.' });
    }

    // Cria o relacionamento de seguidor no banco de dados
    const novoSeguidor = await prisma.seguidor.create({
      data: {
        seguidorId,
        usuarioSeguidoId,
      },
    });

    res.json(novoSeguidor);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao seguir usuário.' });
  }
};

export const obterSeguidores = async (req: Request, res: Response) => {
  try {
    const seguidores = await prisma.seguidor.findMany();
    res.json(seguidores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter seguidores.' });
  }
};



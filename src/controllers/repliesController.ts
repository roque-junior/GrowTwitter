// repliesController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const criarReply = async (req: Request, res: Response) => {
  try {
    const { texto, autorId, tweetId } = req.body;

    // Verifica se o tweet original existe
    const tweetOriginal = await prisma.tweet.findUnique({
      where: { id: tweetId },
    });

    if (!tweetOriginal) {
      return res.status(404).json({ error: 'Tweet original não encontrado.' });
    }

    // Cria a reply no banco de dados
    const novaReply = await prisma.tweet.create({
      data: {
        texto,
        autorId,
        tipo: 'R',
        tweetOriginalId: tweetId,
      },
    });

    res.json(novaReply);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar reply.' });
  }
};

export const obterReplies = async (req: Request, res: Response) => {
  try {
    const replies = await prisma.tweet.findMany({
      where: { tipo: 'R' },
    });
    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter replies.' });
  }
};



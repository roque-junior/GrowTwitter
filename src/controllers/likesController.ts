// likesController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const criarLike = async (req: Request, res: Response) => {
  try {
    const { usuarioId, tweetId } = req.body;

    // Verifica se o tweet existe
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
    });

    if (!tweet) {
      return res.status(404).json({ error: 'Tweet não encontrado.' });
    }

    // Verifica se o usuário já curtiu o tweet
    const likeExistente = await prisma.like.findFirst({
      where: { usuarioId, tweetId },
    });

    if (likeExistente) {
      return res.status(400).json({ error: 'Você já curtiu este tweet.' });
    }

    // Cria o like no banco de dados
    const novoLike = await prisma.like.create({
      data: {
        usuarioId,
        tweetId,
      },
    });

    res.json(novoLike);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar like.' });
  }
};

export const obterLikes = async (req: Request, res: Response) => {
  try {
    const likes = await prisma.like.findMany();
    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter likes.' });
  }
};



// tweetsController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const criarTweet = async (req: Request, res: Response) => {
  try {
    const { texto, autorId, tipo, tweetOriginalId } = req.body;

    if (tipo === 'R' && !tweetOriginalId) {
      return res.status(400).json({ error: 'Um tweet do tipo reply deve conter uma referência ao tweet original.' });
    }

    const novoTweet = await prisma.tweet.create({
      data: {
        texto,
        autorId,
        tipo,
        tweetOriginalId,
      },
    });

    res.json(novoTweet);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tweet.' });
  }
};

export const obterTweets = async (req: Request, res: Response) => {
  try {
    const tweets = await prisma.tweet.findMany();
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter tweets.' });
  }
};



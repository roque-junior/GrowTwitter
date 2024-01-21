// authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'seu_segredo_super_secreto'; // Substitua pelo seu segredo

interface DecodedToken {
  userId: string;
  username: string;

}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Obtenha o token do cabeçalho da solicitação
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  try {
    // Verifique se o token é válido
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
    req.user = decoded; // Adicione as informações do usuário ao objeto de solicitação
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};

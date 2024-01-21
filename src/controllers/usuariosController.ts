// usuariosController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const SECRET_KEY = 'seu_segredo_super_secreto'; // Substitua pelo seu segredo

export const criarUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body;

    // Gera o hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Cria o usuário no banco de dados
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash, // Salva o hash da senha
      },
    });

    res.json(novoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
};

export const obterUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter usuários.' });
  }
};

export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const { username, senha } = req.body;

    // Verifica se o usuário existe no banco de dados
    const usuario = await prisma.usuario.findUnique({
      where: {
        OR: [
          { nome: username },
          { email: username },
        ],
      },
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    // Verifica se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);

    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    // Gera um token JWT
    const token = jwt.sign(
      { userId: usuario.id, username: usuario.nome },
      SECRET_KEY,
      { expiresIn: '1h' } // Define um tempo de expiração do token
    );

    // Retorna o token no response
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar login.' });
  }
};



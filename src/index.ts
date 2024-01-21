
import express from 'express';
import * as usuariosController from './controllers/usuariosController';
import * as tweetsController from './controllers/tweetsController';
import * as likesController from './controllers/likesController';
import * as seguidoresController from './controllers/seguidoresController';
import * as repliesController from './controllers/repliesController';
import { authMiddleware } from './authMiddleware';

const app = express();
const port = 3000;

app.use(express.json());

// Rotas públicas (sem autenticação)
app.post('/login', usuariosController.loginUsuario);

// Middleware de autenticação para rotas protegidas
app.use(authMiddleware);

// Rotas protegidas (requerem autenticação)
app.post('/tweets', tweetsController.criarTweet);
app.get('/tweets', tweetsController.obterTweets);

app.post('/likes', likesController.criarLike);
app.get('/likes', likesController.obterLikes);

app.post('/seguidores', seguidoresController.seguirUsuario);
app.get('/seguidores', seguidoresController.obterSeguidores);

app.post('/replies', repliesController.criarReply);
app.get('/replies', repliesController.obterReplies);

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});

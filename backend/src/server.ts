import fastify from 'fastify';
import fastifyCors from '@fastify/cors';

import { routes } from './app/routes';
import { loadEnv } from './config/env';

loadEnv();

const app = fastify();
const PORT = 8080;

// Configuração do CORS para permitir requisições do frontend
app.register(fastifyCors, {
  origin: "*",  // Permitir de todas as origens
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

routes(app);

app.listen({ port: Number(PORT), host: "0.0.0.0" }, (error, address) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(`O servidor está ATIVO --> ${address}`);
});
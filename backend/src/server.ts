import fastify from 'fastify';

import { routes } from './app/routes';
import { loadEnv } from './config/env';

loadEnv();

const app = fastify();
const PORT = 8080;

routes(app);

app.listen({ port: Number(PORT), host: "0.0.0.0" }, (error, address) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(`O servidor está ATIVO --> ${address}`);
});
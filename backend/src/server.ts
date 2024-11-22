import fastify from 'fastify';

import { routes } from './app/routes';
import { loadEnv } from './config/env';

loadEnv();

const app = fastify();
const PORT = process.env.PORT || 8080;

routes(app);

app.listen({ port: Number(PORT) }).then(() => {
  console.log(`O servidor está ATIVO --> http://localhost:${PORT}`);
});
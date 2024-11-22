import { FastifyInstance } from 'fastify';
import { rideRoutes } from './ride.routes';

// Recebe uma instância de um server Fastify criado e executa as funções que lidam com as rotas da API
export const routes = (app: FastifyInstance) => {
  rideRoutes(app);
};
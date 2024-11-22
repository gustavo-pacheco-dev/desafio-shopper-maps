import { FastifyInstance } from 'fastify';
import { estimateRideController } from '../controllers/ride.controller';

// Lida com as rotas de viagem
export const rideRoutes = (app: FastifyInstance) => {
  app.post('/ride/estimate', estimateRideController);
};
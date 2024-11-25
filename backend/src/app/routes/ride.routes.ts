import { FastifyInstance } from 'fastify';
import { confirmRideController, estimateRideController, getRidesController } from '../controllers/ride.controller';

// Lida com as rotas de viagem
export const rideRoutes = (app: FastifyInstance) => {
  app.post('/ride/estimate', estimateRideController);
  app.patch('/ride/confirm', confirmRideController);
  app.get('/ride/:customer_id', getRidesController);
};
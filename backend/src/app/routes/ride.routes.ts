import { FastifyInstance } from 'fastify';
import { confirmRideController, estimateRideController } from '../controllers/ride.controller';

// Lida com as rotas de viagem
export const rideRoutes = (app: FastifyInstance) => {
  app.get("/", async (request, reply) => {
    reply.send({ message: "O servidor está ativo!" });
  });
  app.post('/ride/estimate', estimateRideController);
  app.patch('/ride/confirm', confirmRideController);
};
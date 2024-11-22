import { FastifyReply, FastifyRequest } from 'fastify';

import { estimateRideUseCase } from '../use-cases/ride.estimate.use-case';


export const estimateRideController = async (
  req: FastifyRequest,
  res: FastifyReply
) => {

  try {
    // Extraindo os dados do corpo da request
    const { customer_id, origin, destination } = req.body as {
      customer_id: string;
      origin: string;
      destination: string;
    };

    const customer_id_data = customer_id.trim()
    const origin_data = origin.trim()
    const destination_data = destination.trim()
  
    // Caso não exista customer_id, origin ou destination
    if (!customer_id_data || !origin_data || !destination_data) {
      return res.status(400).send({ 
          error_code: 'INVALID_DATA',
          error_description: 'Por favor, preencha todos os campos.',
      });
    }

    // Caso a origem seja igual ao destino
    if (origin_data === destination_data) {
      return res.status(400).send({ 
          error_code: 'INVALID_DATA',
          error_description: 'O ponto de partida e o destino devem ser diferentes.' 
      });
    }
    
    // Obtendo o trajeto, os motoristas disponíveis e o valor da viagem
    const result = await estimateRideUseCase({ 
      origin: origin_data, 
      destination: destination_data
    });
  
    return res.send(result);

  } catch (error: any) {
    res.status(500).send({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: error.message
    })
  }
};

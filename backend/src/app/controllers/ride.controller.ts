import { FastifyReply, FastifyRequest } from 'fastify';

import { estimateRideUseCase } from '../use-cases/ride.estimate.use-case';
import { ConfirmRideInput, confirmRideUseCase } from '../use-cases/ride.confirm.use-case';
import prisma from '../prisma/client';
import { getRideUseCase } from '../use-cases/ride.get.use-case';


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


export const confirmRideController = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { customer_id, origin, destination, distance, duration, driver, value } = req.body as ConfirmRideInput
  const customer_id_data = customer_id.trim()
  const origin_data = origin.trim()
  const destination_data = destination.trim()

  try {
    // Verificando se os campos são vazios
    if (!customer_id_data || !origin_data || !destination_data || !driver.id || !driver.name || !value) {
      return res.status(400).send({
        error_code: 'INVALID_DATA',
        error_description: 'Os dados fornecidos no corpo da requisição são inválidos'
      });
    }

    // Caso a origem seja igual ao destino
    if (origin_data === destination_data) {
      return res.status(400).send({
        error_code: 'INVALID_DATA',
        error_description: 'O ponto de partida e o destino devem ser diferentes'
      });
    }

    // Buscar o motorista informado no banco de dados
    const selectedDriver = await prisma.drivers.findUnique({
      where: { driver_id: driver.id },
    });

    if (!selectedDriver) {
      return res.status(404).send({
        error_code: 'DRIVER_NOT_FOUND',
        error_description: 'Motorista não encontrado',
      });
    }

    // Verificar se a distância é válida para o motorista selecionado
    if (distance < selectedDriver.min_km) {
      return res.status(406).send({
        error_code: 'INVALID_DISTANCE',
        error_description: `Quilometragem inválida para o motorista`,
      });
    }

    const result = await confirmRideUseCase({
      customer_id,
      origin,
      destination,
      distance,
      duration,
      driver,
      value
    });
    return res.status(200).send(result);
  } catch (error: any) {
    return res.status(400).send({ error: "Houve um erro ao confirmar sua viagem. Tente novamente." });
  }
};

export const getRidesController = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const { customer_id } = req.params as { customer_id: string };
  const { driver_id } = req.query as { driver_id?: string };

  const customerIdData = customer_id.trim()
  const driverIdNumber = Number(driver_id?.trim())

  try {
    // Verificar se o customer_id foi informado
    if (!customerIdData) {
      return res.status(400).send({
        error_code: 'INVALID_DATA',
        error_description: 'Erro! Por favor, informe o ID do cliente.',
      });
    }

    if (driverIdNumber) {
      // Buscando o motorista informado no banco de dados
      const selectedDriver = await prisma.drivers.findUnique({
        where: { driver_id: driverIdNumber },
      });

      if (!selectedDriver) {
        return res.status(400).send({
          error_code: 'INVALID_DRIVER',
          error_description: 'Motorista invalido',
        });
      }
    }

    // Consultar os detalhes da viagem no banco de dados
    const ridesDone = await getRideUseCase({
      customer_id: customerIdData,
      driver_id: driverIdNumber
    });

    if (ridesDone.rides.length == 0) {
      return res.status(404).send({
        error_code: 'NO_RIDES_FOUND',
        error_description: 'Nenhum registro encontrado',
      });
    }

    // Retornar os detalhes da viagem
    return res.status(200).send(ridesDone);
  } catch (error: any) {
    console.error('Erro ao obter detalhes da viagem:', error);
    return res.status(500).send({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'Erro ao obter detalhes da viagem',
    });
  }
}
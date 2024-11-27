import axios, { AxiosRequestConfig } from 'axios';
import { Drivers } from '@prisma/client';

import { getDriverReviews, getDrivers } from '../services/driver.service';


type RoutesApiRequestHeader = AxiosRequestConfig['headers']

interface RoutesApiRequestBody {
  "origin": {
    "address": string
  },
  "destination": {
    "address": string
  },
  "travelMode": string,
  "routingPreference": string,
  "computeAlternativeRoutes": boolean,
  "routeModifiers": {
    "avoidTolls": boolean,
    "avoidHighways": boolean,
    "avoidFerries": boolean
  },
  "languageCode": string,
  "units": string
}

interface RoutesApiResponseBody {
  "routes": [
    {
      "legs": [
        {
          "startLocation": {
            "latLng": {
              "latitude": number,
              "longitude": number
            }
          },
          "endLocation": {
            "latLng": {
              "latitude": number,
              "longitude": number
            }
          }
        }
      ],
      "distanceMeters": number,
      "duration": string,
      "polyline": {
        "encodedPolyline": string
      }
    }
  ]
}

export const estimateRideUseCase = async ({
  origin,
  destination,
}: {
  origin: string;
  destination: string;
}) => {

  const routesAPIKey = process.env.GOOGLE_API_KEY;
  const apiUrl = `https://routes.googleapis.com/directions/v2:computeRoutes`;

  try {
    // Definindo os headers da requisição
    const requestHeaders: RoutesApiRequestHeader = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": routesAPIKey, // Chave da API
      "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.legs.startLocation,routes.legs.endLocation",
    };

    // Definindo o body da requisição
    const requestBody: RoutesApiRequestBody = {
      origin: {
        address: origin.trim()
      },
      destination: {
        address: destination.trim()
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false
      },
      languageCode: "pt-BR",
      units: "METRIC"
    };

    // Chamando a API do Google Maps
    const response = await axios.post(apiUrl, requestBody, {
      headers: requestHeaders,
    });

    // Obtendo os dados da response da API
    const data: RoutesApiResponseBody = response.data;
    const routeResponse = data; // Resposta original da rota no Google Maps

    const route = data.routes[0]; // Obtendo a primeira rota
    const leg = route.legs[0]; // Obtendo apenas a primeira etapa da rota para obter as coordenadas da partida e do destino

    const originCoordinates = leg.startLocation.latLng; // Coordenadas do endereço de partida
    const destinationCoordinates = leg.endLocation.latLng; // Coordenadas do endereço de destino
    const distance = route.distanceMeters / 1000; // Distância em Km
    const duration = `${Math.ceil(parseInt(route.duration) / 60)} minutos`; // Duração da viagem em minutos

    const drivers: Drivers[] = await getDrivers(); // Obtendo os motoristas cadastrados

    // Gerando as opções de motorista com seus preços
    const options = await Promise.all(
      drivers
        .filter((driver) => !(driver.min_km && distance < driver.min_km)) // Filtrando os motoristas por mínimo de quilômetros para uma viagem
        .map(async (driver) => {

          // Removendo atributos para não retorná-los na response
          const { cpf, min_km, price_per_km, driver_id, createdAt, ...rest } = driver

          // Obtendo as avaliações do motorista para retornar a mais recente na response
          const reviews = await getDriverReviews(driver_id)

          // Calculando o preço do motorista e retornando o motorista sem o atributo "minKm"
          return {
            id: driver.driver_id,
            ...rest,
            review: {
              rating: reviews[0]?.rating ?? null,
              comment: reviews[0]?.comment ?? 'Sem avaliações'
            },
            value: driver.price_per_km * distance,
          }
        })
    )

    options.sort((a, b) => a.value - b.value); // Ordenando o preço do menor para o maior
    return {
      origin: originCoordinates,
      destination: destinationCoordinates,
      distance,
      duration,
      options,
      routeResponse,
    };
  } catch (error) {
    console.error('Erro ao chamar a API de rotas', error);
    throw new Error('Não foi possível calcular a rota no momento.');
  }
};

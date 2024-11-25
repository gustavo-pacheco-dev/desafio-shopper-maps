import prisma from "../prisma/client"

export interface ConfirmRideInput {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

export const confirmRideUseCase = async (input: ConfirmRideInput) => {
  const { customer_id, origin, destination, distance, duration, driver, value } = input;

  // Salvar a corrida no banco
  await prisma.rides.create({
    data: {
      customer_id: customer_id,
      origin,
      destination,
      distance,
      duration,
      driver_id: driver.id,
      driver_name: driver.name,
      value,
    },
  });

  return { success: true };
}
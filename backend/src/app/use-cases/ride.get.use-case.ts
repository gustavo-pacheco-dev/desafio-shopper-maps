import { getRides } from "../services/driver.service";

interface GetRideInput {
    customer_id: string;
    driver_id?: number;
}

interface RideConfirmed {
    id: number;
    date: Date;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: {
        id: number;
        name: string;
    }
    value: number;
}

interface GetRideResponse {
    customer_id: string;
    rides: Array<RideConfirmed>
}

export const getRideUseCase = async (input: GetRideInput) => {
    const ridesDone = await getRides(input.customer_id, input.driver_id)

    // Response conforme a estrutura solicitada pelo Desafio Shopper
    return {
        customer_id: input.customer_id,
        rides: ridesDone.map((ride) => {
            return {
                id: ride.ride_id,
                date: ride.createdAt,
                origin: ride.origin,
                destination: ride.destination,
                distance: ride.distance,
                duration: ride.duration,
                driver: {
                    id: ride.driver_id,
                    name: ride.driver_name
                },
                value: ride.value
            } as RideConfirmed
        })
    } as GetRideResponse
}
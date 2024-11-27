import prisma from "../prisma/client";

export const getDrivers = async () => await prisma.drivers.findMany();
export const getDriverReviews = async (driverId: number) => await prisma.ratings.findMany({
    where: {
        driver_id: driverId
    },
    orderBy: {
        createdAt: "desc"
    }
});
export const getRides = async (customerIdToFind: string, driverIdToFind?: number) => await prisma.rides.findMany({
    where: {
        customer_id: customerIdToFind,
        ...(driverIdToFind ? { driver_id: driverIdToFind } : {})
    },
    include: {
        driver: true, // Inclui os dados do motorista na resposta
    },
    orderBy: {
        createdAt: "desc"
    }
});

import prisma from "../prisma/client";

export const getDrivers = async () => await prisma.drivers.findMany();
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

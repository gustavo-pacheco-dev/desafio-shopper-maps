import prisma from "../prisma/client";

export const getDrivers = async () => await prisma.drivers.findMany();

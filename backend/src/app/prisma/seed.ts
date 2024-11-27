import prisma from "./client";


// Script utilizado para inserir os dados iniciais no banco de dados, apenas na primeira execução
async function main() {

    // Verificar se já existem registros na tabela de motoristas
    const driversCount = await prisma.drivers.count();
    const customersCount = await prisma.customers.count();
    const ridesCount = await prisma.rides.count();
    const ratingsCount = await prisma.ratings.count();

    if (driversCount === 0) {
        // Inserir dados iniciais na tabela Drivers
        await prisma.drivers.createMany({
            data: [
                {
                    driver_id: 1,
                    cpf: "12378945611",
                    name: 'Homer Simpson',
                    description: 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
                    vehicle: 'Plymouth Valiant 1973',
                    price_per_km: 2.5,
                    min_km: 1,
                },
                {
                    driver_id: 2,
                    cpf: "45678912312",
                    name: 'Dominic Toretto',
                    description: 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
                    vehicle: 'Dodge Charger R/T 1970',
                    price_per_km: 5.0,
                    min_km: 5,
                },
                {
                    driver_id: 3,
                    cpf: "78912345612",
                    name: 'James Bond',
                    description: 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
                    vehicle: 'Aston Martin DB5',
                    price_per_km: 10.0,
                    min_km: 10,
                },
            ],
        });
    }

    if (customersCount === 0) {
        // Inserir dados iniciais na tabela Customers
        await prisma.customers.createMany({
            data: [
                {
                    customer_id: "861d5813-5869-449d-a191-9fe66fcd64ef",
                    cpf: "12345678910",
                    name: "Albert Einstein",
                },
                {
                    customer_id: "55df6190-9500-4f5d-ab85-bcdeb41ee4c7",
                    cpf: "11122233344",
                    name: "Alan Turing",
                },
                {
                    customer_id: "31163a0e-5a18-45ae-a977-c7eb72da4ef1",
                    cpf: "10120230340",
                    name: "Isaac Newton",
                },
                {
                    customer_id: "ae0d3135-f118-4e8a-b76d-57217d51eba4",
                    cpf: "30340450560",
                    name: "Linus Torvalds",
                },
            ],
        });
    }

    if (ridesCount === 0) {
        await prisma.rides.createMany({
            data: [
                {
                    ride_id: 1,
                    customer_id: "861d5813-5869-449d-a191-9fe66fcd64ef",
                    origin: "Teatro Amazonas, Manaus",
                    destination: "Amazonas Shopping, Manaus",
                    distance: 5.296,
                    duration: "13 minutos",
                    driver_id: 1,
                    driver_name: "Homer Simpson",
                    value: 13.24
                },
                {
                    ride_id: 2,
                    customer_id: "31163a0e-5a18-45ae-a977-c7eb72da4ef1",
                    origin: "Casarão de Ideias, Manaus",
                    destination: "Manauara Shopping, Manaus",
                    distance: 5.228,
                    duration: "19 minutos",
                    driver_id: 2,
                    driver_name: "Dominic Toretto",
                    value: 26.14
                },
                {
                    ride_id: 3,
                    customer_id: "861d5813-5869-449d-a191-9fe66fcd64ef",
                    origin: "Amazonas Shopping, Manaus",
                    destination: "MUSA, Manaus",
                    distance: 19.346,
                    duration: "31 minutos",
                    driver_id: 3,
                    driver_name: "James Bond",
                    value: 193.46
                },
                {
                    ride_id: 4,
                    customer_id: "31163a0e-5a18-45ae-a977-c7eb72da4ef1",
                    origin: "INPA, Manaus",
                    destination: "UFAM, Manaus",
                    distance: 7.745,
                    duration: "22 minutos",
                    driver_id: 1,
                    driver_name: "Homer Simpson",
                    value: 19.3625
                },
                {
                    ride_id: 5,
                    customer_id: "55df6190-9500-4f5d-ab85-bcdeb41ee4c7",
                    origin: "UEA - EST, Manaus",
                    destination: "McDonald's Djalma Batista, Manaus",
                    distance: 5.061,
                    duration: "18 minutos",
                    driver_id: 2,
                    driver_name: "Dominic Toretto",
                    value: 25.305
                },
            ]
        })
    }

    if (ratingsCount === 0) {
        await prisma.ratings.createMany({
            data: [
                {
                    id: 1,
                    ride_id: 1,
                    driver_id: 1,
                    customer_id: "861d5813-5869-449d-a191-9fe66fcd64ef",
                    rating: 2,
                    comment: "Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts."
                },
                {
                    id: 2,
                    ride_id: 2,
                    driver_id: 2,
                    customer_id: "31163a0e-5a18-45ae-a977-c7eb72da4ef1",
                    rating: 4,
                    comment: "Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!"
                },
                {
                    id: 3,
                    ride_id: 3,
                    driver_id: 3,
                    customer_id: "861d5813-5869-449d-a191-9fe66fcd64ef",
                    rating: 5,
                    comment: "Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto."
                },
            ]
        })
    }

    // Alterando os valores iniciais dos ID's incrementais para começar de acordo com o útlimo ID gerado
    await prisma.$queryRaw`SELECT setval(
        pg_get_serial_sequence('"Rides"', 'ride_id'), 
        (SELECT MAX(ride_id) FROM "Rides")
    )`;
    await prisma.$queryRaw`SELECT setval(
        pg_get_serial_sequence('"Drivers"', 'driver_id'), 
        (SELECT MAX(driver_id) FROM "Drivers")
    )`;
    await prisma.$queryRaw`SELECT setval(
        pg_get_serial_sequence('"Ratings"', 'id'), 
        (SELECT MAX(id) FROM "Ratings")
    )`;

    console.log("Script de inicializacao [OK]")
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

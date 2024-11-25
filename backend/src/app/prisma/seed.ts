import prisma from "./client";


// Script utilizado para inserir dados iniciais no banco de dados apenas na primeira execução
async function main() {

    // Verificar se já existem registros na tabela de motoristas
    const driversCount = await prisma.drivers.count();
    const customersCount = await prisma.customers.count();

    if (driversCount === 0) {
        // Inserir dados iniciais na tabela Drivers
        await prisma.drivers.createMany({
            data: [
                {
                    cpf: "12378945611",
                    name: 'Homer Simpson',
                    description: 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
                    vehicle: 'Plymouth Valiant 1973',
                    price_per_km: 2.5,
                    min_km: 1,
                },
                {
                    cpf: "45678912312",
                    name: 'Dominic Toretto',
                    description: 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
                    vehicle: 'Dodge Charger R/T 1970',
                    price_per_km: 5.0,
                    min_km: 5,
                },
                {
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
                    cpf: "12345678910",
                    name: "Albert Einstein",
                },
                {
                    cpf: "11122233344",
                    name: "Alan Turing",
                },
            ],
        });
    }

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

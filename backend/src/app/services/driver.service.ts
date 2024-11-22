export const getDrivers = () => [
    {
        id: 1,
        name: 'Homer Simpson',
        description: 'Motorista simpático, mas errou o caminho 3 vezes.',
        vehicle: 'Plymouth Valiant 1973',
        review: { rating: 2, comment: 'Cheiro de donuts.' },
        pricePerKm: 2.5,
        minKm: 1,
    },
    {
        id: 2,
        name: 'Dominic Toretto',
        description: 'Motorista rápido e eficiente.',
        vehicle: 'Dodge Charger R/T 1970',
        review: { rating: 4, comment: 'Carro incrível!' },
        pricePerKm: 5.0,
        minKm: 5,
    },
    {
        id: 3,
        name: 'James Bond',
        description: 'Motorista de classe.',
        vehicle: 'Aston Martin DB5',
        review: { rating: 5, comment: 'Viagem impecável.' },
        pricePerKm: 10.0,
        minKm: 10,
    },
];

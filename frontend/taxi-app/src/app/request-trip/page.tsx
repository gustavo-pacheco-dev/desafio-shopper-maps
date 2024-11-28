"use client"; // Habilitando o uso de React Hooks como o useState

import React, { useState } from "react";

import styles from "./request_trip.module.css";
import { Box, Button, TextField } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

export interface Driver {
    id: number;
    name: string | null;
    description: string;
    vehicle: string;
    review: {
        rating: number;
        comment: string;
    };
    value: number;
}

interface GetRideEstimateApiRequest {
    customer_id: string,
    origin: string,
    destination: string,
}

interface GetRideEstimateApiResponse {
    origin: {
        latitude: number,
        longitude: number
    },
    destination: {
        latitude: number,
        longitude: number
    },
    distance: number,
    duration: string,
    options: Driver[],
    routeResponse: {
        routes: [
            {
                polyline: {
                    encodedPolyline: string;
                    [key: string]: any;
                }
                [key: string]: any;
            }
        ]
        [key: string]: any;
    },
}

export interface LocalStorageTripData {
    customer_id: string;
    originText: string;
    destinationText: string;
    data: GetRideEstimateApiResponse;
}

export default function RequestTrip() {
    const [userId, setUserId] = useState("");
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const router = useRouter();


    const handleEstimatePrice = async () => {
        if (!userId || !origin || !destination) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {

            const response = await fetch("http://localhost:8080/ride/estimate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customer_id: userId.trim(),
                    origin: origin.trim(),
                    destination: destination.trim(),
                } as GetRideEstimateApiRequest),
            });

            if (!response.ok) {
                throw new Error("Erro ao obter a estimativa. Tente novamente.");
            }

            const data: GetRideEstimateApiResponse = await response.json();

            // Armazena a resposta da API no localStorage para uso posterior
            localStorage.setItem("tripData", JSON.stringify({
                customer_id: userId.trim(),
                originText: origin.trim(),
                destinationText: destination.trim(),
                data: data
            } as LocalStorageTripData));

            router.push("/confirm-trip");

        } catch (error) {
            alert("Desculpe, houve um erro ao obter o preço da sua viagem.")
            console.error("Erro ao obter a estimativa:", error);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Solicitar Corrida</h1>
            </header>

            <main className={styles.main}>
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", maxWidth: 400 }}
                >
                    <TextField
                        label="ID do Usuário"
                        variant="outlined"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        fullWidth
                        sx={{
                            "& .MuiInputLabel-root": { color: "#1565c0" },
                            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#1565c0",
                            },
                            "& .MuiOutlinedInput-root": {
                                color: "#fff",
                                borderColor: "#fff",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#fff",
                            },
                        }}
                    />
                    <TextField
                        label="Endereço de Origem"
                        variant="outlined"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        fullWidth
                        sx={{
                            "& .MuiInputLabel-root": { color: "#1565c0" },
                            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#1565c0",
                            },
                            "& .MuiOutlinedInput-root": {
                                color: "#fff",
                                borderColor: "#fff",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#fff",
                            },
                        }}
                    />
                    <TextField
                        label="Endereço de Destino"
                        variant="outlined"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        fullWidth
                        sx={{
                            "& .MuiInputLabel-root": { color: "#1565c0" },
                            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#1565c0",
                            },
                            "& .MuiOutlinedInput-root": {
                                color: "#fff",
                                borderColor: "#fff",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#fff",
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEstimatePrice}
                    >
                        Estimar Preço
                    </Button>
                    <Button
                        href="/"
                        variant="outlined"
                        startIcon={<ArrowBack />}
                    >
                        Voltar
                    </Button>
                </Box>
            </main>
        </div>
    )
}
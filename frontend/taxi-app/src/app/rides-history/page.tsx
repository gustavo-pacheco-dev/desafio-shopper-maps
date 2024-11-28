"use client"; // Habilitando o uso de React Hooks como o useState

import { useRouter } from "next/navigation";
import { Button, IconButton, TextField } from "@mui/material"
import ArrowBack from "@mui/icons-material/ArrowBack"
import { LocalStorageTripData } from "../request-trip/page";
import styles from "./rides-history.module.css"
import { useEffect, useState } from "react";
import RideComponent, { Ride } from "../components/RideComponent";
import { Search } from "@mui/icons-material";
import { url } from "inspector";

interface GetRidesApiResponse {
    customer_id: string,
    rides: Ride[]
}


export default function RidesHistory() {
    const [customerId, setCustomerId] = useState("")
    const [driverId, setDriverId] = useState("")
    const [rides, setRides] = useState<Ride[]>([])
    let url = `http://localhost:8080/ride/${customerId}`


    const getRidesHistory = async () => {
        if (!customerId) {
            alert("Por favor, informe o seu ID.");
            return;
        }

        try {

            if (Number(driverId.trim()) >= 0) {
                url = `http://localhost:8080/ride/${customerId}?driver_id=${driverId}`
            }

            console.log(url)

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao obter o histórico de viagens. Tente novamente.");
            }

            const data: GetRidesApiResponse = await response.json()
            setRides(data.rides)
        } catch (error) {
            alert("Desculpe, houve um erro ao obter o histórico de viagens.")
            console.error("Erro ao obter o histórico de viagens: ", error);
        }

    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Button
                    href="/request-trip"
                    variant="outlined"
                    startIcon={<ArrowBack />}
                />
            </header>

            <main className={styles.main}>

                <div className={styles.searchOptions}>
                    <TextField
                        label="ID do Usuário"
                        variant="outlined"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
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
                        label="ID do Motorista"
                        variant="outlined"
                        value={driverId}
                        onChange={(e) => setDriverId(e.target.value)}
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
                        startIcon={<Search />}
                        size="large"
                        onClick={getRidesHistory}
                    />
                </div>

                <div className={styles.line}></div>

                {
                    rides ? (rides.map((ride) => {
                        return (
                            <RideComponent
                                key={ride.id}
                                ride={ride}
                            />
                        )
                    })) : (
                        <></>
                    )

                }
            </main>
        </div>
    )
}
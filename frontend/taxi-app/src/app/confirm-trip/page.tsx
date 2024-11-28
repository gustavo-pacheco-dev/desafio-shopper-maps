"use client"; // Habilitando o uso de React Hooks como o useState

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material"
import ArrowBack from "@mui/icons-material/ArrowBack"
import { LocalStorageTripData } from "../request-trip/page";
import styles from "./confirm_trip.module.css"
import DriverOptionCard from "../components/DriverOptionCard";
import MapComponent from "../components/MapComponent";


export default function ConfirmTrip() {
    // Dados iniciais da viagem
    const [tripData, setTripData] = useState({
        customer_id: "",
        originText: "",
        destinationText: "",
        data: {
            origin: {
                latitude: 0,
                longitude: 0
            },
            destination: {
                latitude: 0,
                longitude: 0
            },
            distance: 0,
            duration: "",
            options: [],
            routeResponse: {
                routes: [
                    {
                        polyline: {
                            encodedPolyline: ""
                        }
                    }
                ]
            }
        }
    } as LocalStorageTripData);

    const router = useRouter()

    useEffect(() => {
        try {
            const localStorageTripData = localStorage.getItem("tripData");

            if (!localStorageTripData) {
                alert("Por favor, preencha todos os campos!")
                router.push('/request-trip')
                return;
            }

            setTripData(JSON.parse(localStorageTripData) as LocalStorageTripData)
        } catch (error) {
            console.error("Erro ao carregar os dados da viagem:", error);
            alert("Erro ao carregar os dados. Redirecionando...");
            router.push("/request-trip");
        }

    }, [router])

    if (!tripData) {
        return <div>Carregando dados da viagem...</div>;
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
                <div className={styles.tripOriginAndDestination}>
                    <h1>{tripData.originText}</h1>
                    <div className={styles.line}></div>
                    <h1>{tripData.destinationText}</h1>
                </div>

                {
                    tripData.data.routeResponse.routes[0].polyline.encodedPolyline ? (
                        <MapComponent
                            encodedPolyline={tripData.data.routeResponse.routes[0].polyline.encodedPolyline}
                        />
                    ) : (
                        <>
                        </>
                    )
                }

                <div className={styles.chooseDriver}>
                    <div className={styles.line}></div>
                    <h1>Escolha seu motorista</h1>
                    <div className={styles.line}></div>
                </div>

                {
                    tripData.data.options.map((driver) => {
                        return (
                            <DriverOptionCard
                                key={driver.id}
                                driver={driver}
                                tripData={tripData}
                            />
                        )
                    })
                }
            </main>
        </div>
    )
}
import { Button } from "@mui/material";
import { Driver, LocalStorageTripData } from "../request-trip/page"
import styles from "./driverOptionCard.module.css";
import Image from "next/image";

interface DriverOptionCardProps {
    driver: Driver;
    tripData: LocalStorageTripData;
}

interface ConfirmRideRequestBody {
    customer_id: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: {
        id: number,
        name: string
    },
    value: number;
}

interface ConfirmRideResponseBody {
    success?: boolean;
    error_code?: number;
    error_description?: string;
}

export default function DriverOptionCard({ driver, tripData }: DriverOptionCardProps) {
    const { customer_id, originText, destinationText, data } = tripData

    const handleConfirmRide = async () => {

        try {
            const response = await fetch("http://localhost:8080/ride/confirm", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customer_id: customer_id.trim(),
                    origin: originText.trim(),
                    destination: destinationText.trim(),
                    distance: data.distance,
                    duration: data.duration,
                    driver: {
                        id: driver.id,
                        name: driver.name
                    },
                    value: driver.value
                } as ConfirmRideRequestBody),
            });

            if (!response.ok) {
                throw new Error("Erro ao confirmar sua viagem. Tente novamente.");
            }

            const confirmRideResponse: ConfirmRideResponseBody = await response.json();

            if (confirmRideResponse.success) {
                alert("Viagem solicitada com sucesso!!")
            } else {
                throw new Error(confirmRideResponse.error_description);
            }

        } catch (error: any) {
            alert(error.message)
        }
    }

    return (
        <div className={styles.card}>

            <div className={styles.driverSection}>
                <Image
                    src="/profile.svg"
                    alt="Foto de Perfil"
                    width={64}
                    height={64}
                />

                <div className={styles.driverNameAndReview}>
                    <div className={styles.nameAndDescription}>
                        <p className={styles.name}>{driver.name}</p>
                        <p className={styles.description}>{driver.description}</p>
                    </div>


                    {
                        driver.review.rating ? (
                            <div className={styles.review}>
                                <p className={styles.rating}>Última avaliação: {driver.review.rating} / 5</p>
                                <p className={styles.comment}>{driver.review.comment}</p>
                            </div>
                        ) : (
                            <></>
                        )
                    }
                </div>
            </div>

            <div className={styles.line} />

            <div className={styles.carSection}>
                <Image
                    src="/taxi.svg"
                    alt="Ícone de Taxi"
                    width={64}
                    height={64}
                />
                <p className={styles.vehicle}>{driver.vehicle}</p>
                <p className={styles.value}>
                    R${driver.value.toFixed(2).replace(".", ",")}
                </p>
                <Button variant="contained" onClick={handleConfirmRide}>
                    <p>Escolher</p>
                </Button>
            </div>
        </div>
    )
}
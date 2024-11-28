import styles from "./rideComponent.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from 'date-fns';


export interface Ride {
    id: number;
    date: Date;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: {
        id: number;
        name: string
    };
    value: number
}

interface RideProps {
    ride: Ride
}

export default function RideComponent({ ride }: RideProps) {
    const { driver, origin, destination, distance, duration, value, date } = ride
    const router = useRouter()

    return (
        <div className={styles.card}>

            <div className={styles.rideSection}>
                <Image
                    src="/profile.svg"
                    alt="Foto de Perfil"
                    width={64}
                    height={64}
                />

                <div className={styles.rideInformation}>
                    <div className={styles.nameDiv}>
                        <p className={styles.name}>{driver.name}</p>
                    </div>

                    <div className={styles.dateDiv}>
                        <p className={styles.date}>Realizada em: {format(new Date(date), 'dd/MM/yyyy')}</p>
                        <p className={styles.origin}>Partida: {origin}</p>
                        <p className={styles.destination}>Destino: {destination}</p>
                        <p className={styles.distance}>Distância: {distance.toFixed(1).toString().replace('.', ',')} km</p>
                        <p className={styles.duration}>Duração: {duration}</p>
                    </div>

                </div>
            </div>

            <div>
                <div className={styles.valueSection}>
                    <Image
                        src="/taxi.svg"
                        alt="Ícone de Taxi"
                        width={88}
                        height={88}
                    />
                    <p className={styles.value}>
                        R${value.toFixed(2).replace(".", ",")}
                    </p>
                </div>
            </div>
        </div>
    )
}
import Image from "next/image";
import Link from "next/link";

import styles from "./page.module.css";
import { Button } from "@mui/material";
import "@fontsource/roboto/400.css"; // Normal
import "@fontsource/roboto/700.css"; // Bold
import ArrowForward from "@mui/icons-material/ArrowForward";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          src="/taxi.svg"
          alt="Ícone de um taxi"
          width={150}
          height={150}
        />

        <h1>Solicite seu taxi de forma rápida e prática!</h1>

        <Link href="/request-trip" passHref>
          <Button variant="contained" size="large" endIcon={<ArrowForward />}>
            <p>Quero pedir</p>
          </Button>
        </Link>
      </main>
    </div>
  );
}

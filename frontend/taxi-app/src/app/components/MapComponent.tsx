"use client"; // Habilitando o uso de React Hooks como o useState

import { GoogleMap, Polyline, useLoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

interface MapComponentProps {
    encodedPolyline: string;
}

export default function MapComponent({ encodedPolyline }: MapComponentProps) {
    const [polylinePath, setPolylinePath] = useState<any[]>([]);

    // Carregar a API do Google Maps
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY!,
        libraries: ['geometry'], // Bibliotecas necessárias para trabalhar com geodesia
    });

    // Função para decodificar a polyline codificada
    const decodePolyline = (encoded: string) => {
        if (encoded && typeof google !== "undefined") {
            const path = google.maps.geometry.encoding.decodePath(encoded);

            // Decodifica a polyline se o Google Maps estiver disponível e a string não for vazia
            return path.map((point: google.maps.LatLng) => ({
                lat: point.lat(),
                lng: point.lng(),
            }));
        }

        return []; // Retorna um array vazio caso a polyline não seja válida
    };

    useEffect(() => {

        // Decodifica a polyline codificada e atualiza o estado apenas quando o Google Maps estiver carregado
        if (isLoaded && encodedPolyline) {
            const decodedPath = decodePolyline(encodedPolyline);
            setPolylinePath(decodedPath as any[]);
        }
    }, [isLoaded, encodedPolyline]); // Verifica se a API foi carregada e se a polyline mudou

    if (!isLoaded) {
        return <div>Carregando mapa...</div>;
    }

    // Se a polylinePath não contiver coordenadas válidas
    if (polylinePath.length === 0) {
        return <div>Mapa sem rota disponível.</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={{
                height: "500px",
                width: "100%"
            }}
            center={polylinePath[0]}
            zoom={14}
        >
            {
                polylinePath ? (
                    <Polyline
                        path={polylinePath as google.maps.LatLng[]}
                        options={{
                            geodesic: true,
                            strokeColor: "#FF0000",
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        }}
                    />

                ) : (
                    <></>
                )
            }
        </GoogleMap>
    );
}

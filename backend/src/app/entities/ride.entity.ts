export interface Ride {
    origin: { latitude: number; longitude: number };
    destination: { latitude: number; longitude: number };
    distance: number;
    duration: string;
    options: object[];
    routeResponse: object;
  }
  
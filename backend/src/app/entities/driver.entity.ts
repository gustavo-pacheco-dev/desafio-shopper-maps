export interface Driver {
  id: number;
  cpf: number;
  name: string;
  description: string;
  vehicle: string;
  review: {
    rating: number;
    comment: string;
  };
  price_per_km: number;
  minKm?: number;
}

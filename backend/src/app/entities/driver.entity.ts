export interface Driver {
    id: number;
    name: string;
    description: string;
    vehicle: string;
    review: {
      rating: number;
      comment: string;
    };
    pricePerKm: number;
    minKm?: number;
  }
  
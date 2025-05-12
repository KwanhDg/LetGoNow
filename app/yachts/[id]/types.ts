export interface Image {
  url: string;
  alt?: string;
}

export interface Room {
  id: number;
  name: string;
  area: number;
  max_guests: number;
  price: number;
  images: Image[];
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Yacht {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  rating: number;
  reviewCount: number;
  location: string;
  duration: string;
  departureTime: string;
  images: Image[];
  rooms: Room[];
  highlights: string[];
  itinerary: {
    time: string;
    activity: string;
  }[];
  included: string[];
  notIncluded: string[];
  reviews: Review[];
} 
export type MenuItem = {
  id: string;
  name: string;
  price: number;
  emoji?: string;
  description?: string;
  imageUrl?: string;
};

export type Business = {
  id: string;
  name: string;
  category: string;
  area: string;
  state: string;
  tier: "Budget" | "Mid" | "Premium" | "Luxury";
  description: string;
  imageUrl: string;
  rating: number;
  visits: number;
  capacity: number;
  menu: MenuItem[];
};

export type Category = {
  id: string;
  name: string;
  emoji: string;
};

export const CATEGORIES: Category[] = [
  { id: "restaurants", name: "Restaurants", emoji: "🍽️" },
  { id: "bars", name: "Bars & Lounges", emoji: "🍺" },
  { id: "salons", name: "Salons & Barbershops", emoji: "💇" },
  { id: "boutiques", name: "Boutiques", emoji: "👗" },
  { id: "jewelry", name: "Jewelry Stores", emoji: "💍" },
  { id: "cars", name: "Car Dealerships", emoji: "🚗" },
  { id: "electronics", name: "Electronics Stores", emoji: "📱" },
  { id: "hotels", name: "Hotels & Suites", emoji: "🏨" },
  { id: "gyms", name: "Gyms & Fitness", emoji: "🏋️" },
  { id: "cinemas", name: "Cinemas & Clubs", emoji: "🎬" },
];

export const CAPACITY_BY_CATEGORY: Record<string, number> = {
  restaurants: 40,
  bars: 60,
  salons: 8,
  boutiques: 15,
  jewelry: 5,
  cars: 3,
  electronics: 10,
  hotels: 20,
  gyms: 25,
  cinemas: 100,
};

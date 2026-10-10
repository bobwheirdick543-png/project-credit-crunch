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

// Minimal stubs — full category & business data will come from the new District package
export const CATEGORIES: Category[] = [];

export const CAPACITY_BY_CATEGORY: Record<string, number> = {};

import shoeImg from '@/assets/product-shoe.jpg';
import apparelImg from '@/assets/product-apparel.jpg';
import bagImg from '@/assets/product-bag.jpg';
import watchImg from '@/assets/product-watch.jpg';
import suyaImg from '@/assets/product-suya.jpg';
import egusiImg from '@/assets/product-egusi.jpg';
import pepperImg from '@/assets/product-pepper.jpg';
import puffImg from '@/assets/product-puff.jpg';
import supercarImg from '@/assets/product-supercar.jpg';
import sedanImg from '@/assets/product-sedan.jpg';
import drinksImg from '@/assets/product-drinks.jpg';
import cinemaImg from '@/assets/product-cinema.jpg';
import restaurantImg from '@/assets/restaurants.jpg';
import carsImg from '@/assets/cars.jpg';
import boutiqueImg from '@/assets/boutiques.jpg';
import jewelryImg from '@/assets/jewelry.jpg';
import barsImg from '@/assets/bars.jpg';
import salonsImg from '@/assets/salons.jpg';
import electronicsImg from '@/assets/electronics.jpg';
import hotelsImg from '@/assets/hotels.jpg';
import gymsImg from '@/assets/gyms.jpg';
import foodImg from '@/assets/jollof.jpg';
import suvImg from '@/assets/luxury-suv.jpg';

export type CategoryId = string;
export type Product = {
  id: string;
  name: string;
  price: number;
  brand?: string;
  mark?: string;
  image?: string;
  type: 'food' | 'car' | 'fashion' | 'general';
  description: string;
  engine?: string;
  hp?: number;
  mileage?: number;
  transmission?: string;
  sizeType?: 'shoe' | 'clothing';
};
export type Business = {
  id: string;
  name: string;
  category: string;
  city: string;
  area: string;
  tier: 'street' | 'casual' | 'luxury';
  rating: number;
  products: Product[];
  tag: string;
  image?: string;
};

export const cities = ['Abuja', 'Lagos', 'Port Harcourt', 'Enugu', 'Delta', 'Ibadan', 'Kano', 'Benin', 'Calabar', 'BS Island'];

export const categories = [
  { id: 'restaurants', name: 'Restaurants', sub: 'From street bites to fine dining', image: restaurantImg, icon: 'UtensilsCrossed', count: 24 },
  { id: 'car-dealerships', name: 'Car Dealerships', sub: 'Your next statement on wheels', image: carsImg, icon: 'CarFront', count: 12 },
  { id: 'boutiques', name: 'Boutiques', sub: 'Streetwear. Native drip. Luxury.', image: boutiqueImg, icon: 'Shirt', count: 18 },
  { id: 'jewelry', name: 'Jewelry & Watches', sub: 'A little shine. A lot of presence.', image: jewelryImg, icon: 'Gem', count: 8 },
  { id: 'bars-lounges', name: 'Bars & Lounges', sub: 'Good nights, great company', image: barsImg, icon: 'Wine', count: 16 },
  { id: 'salons', name: 'Salons & Barbers', sub: 'Stay sharp. Look the part.', image: salonsImg, icon: 'Scissors', count: 14 },
  { id: 'electronics', name: 'Electronics', sub: 'Upgrade your everyday', image: electronicsImg, icon: 'Smartphone', count: 10 },
  { id: 'hotels', name: 'Hotels & Suites', sub: 'Check into something exceptional', image: hotelsImg, icon: 'BedDouble', count: 9 },
  { id: 'gyms', name: 'Gyms & Fitness', sub: 'Build strength. Find your rhythm.', image: gymsImg, icon: 'Dumbbell', count: 7 },
  { id: 'cinemas', name: 'Cinema & Entertainment', sub: 'Big screens. Bigger experiences.', image: cinemaImg, icon: 'Clapperboard', count: 6 },
];

const product = (id: string, name: string, price: number, type: Product['type'], description: string, extra: Partial<Product> = {}): Product => ({
  id, name, price, type, description, image: extra.image, ...extra,
});

export const foodProducts = [
  product('jollof', 'Smoky Jollof & Grilled Chicken', 12000, 'food', 'Party-style rice, flame-grilled chicken and sweet plantain', { image: foodImg }),
  product('suya', 'Signature Suya Platter', 28000, 'food', 'Chargrilled beef, yaji spice and crisp vegetables', { image: suyaImg }),
  product('egusi', 'Egusi & Pounded Yam', 18000, 'food', 'Rich melon seed soup, tender beef and fresh pounded yam', { image: egusiImg }),
  product('pepper', 'Catfish Pepper Soup', 15000, 'food', 'Aromatic broth, fresh catfish and native spices', { image: pepperImg }),
  product('puff', 'Puff-Puff & Zobo', 3500, 'food', 'Golden bites and chilled hibiscus drink', { image: puffImg }),
  product('feast', "Chef's Tasting Feast", 65000, 'food', 'Six courses celebrating contemporary Nigerian dining', { image: foodImg }),
];

export const paymentMethods = ['Soul Vault Direct Debit', 'OPai', 'Kudo', 'Palm Bank', 'Gold Trust Bank', 'Zenith Trust Bank'];

function sampleBusinesses(city: string): Business[] {
  const slug = city.toLowerCase().replace(/\s/g, '-');
  return [
    { id: `${slug}-spot-1`, name: `${city} Flame Kitchen`, category: 'restaurants', city, area: 'Central', tier: 'casual', rating: 4.6, products: foodProducts, tag: 'Best jollof in town', image: restaurantImg },
    { id: `${slug}-spot-2`, name: `${city} Motor Hub`, category: 'car-dealerships', city, area: 'Industrial', tier: 'luxury', rating: 4.8, products: [product('sedan1', 'Executive Sedan', 45000000, 'car', 'Premium daily driver', { image: sedanImg }), product('suv1', 'Luxury SUV', 120000000, 'car', 'Statement vehicle', { image: suvImg })], tag: 'Premium motors', image: carsImg },
    { id: `${slug}-spot-3`, name: `${city} Style House`, category: 'boutiques', city, area: 'Fashion Row', tier: 'casual', rating: 4.4, products: [product('tee1', 'Dri-Tee', 25000, 'fashion', 'Street essential', { sizeType: 'clothing', image: apparelImg }), product('shoe1', 'Court Low', 85000, 'fashion', 'Everyday kicks', { sizeType: 'shoe', image: shoeImg })], tag: 'Streetwear & native', image: boutiqueImg },
    { id: `${slug}-spot-4`, name: `${city} Lounge`, category: 'bars-lounges', city, area: 'Nightlife', tier: 'luxury', rating: 4.7, products: [product('drink1', 'Signature Cocktail', 15000, 'food', 'House special', { image: drinksImg })], tag: 'VIP nights', image: barsImg },
  ];
}

export function cityCatalog(city: string): Business[] {
  return sampleBusinesses(city || 'Abuja');
}

export function findBusiness(id: string): Business | undefined {
  for (const c of cities) {
    const b = cityCatalog(c).find((x) => x.id === id);
    if (b) return b;
  }
  return undefined;
}

export const autoBrands = [] as const;

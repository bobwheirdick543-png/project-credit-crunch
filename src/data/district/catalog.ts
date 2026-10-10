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
export type CategoryId=string;
export type Product={id:string;name:string;price:number;brand?:string | undefined;mark?:string | undefined;image?:string | undefined;type:'food'|'car'|'fashion'|'general';description:string;engine?:string | undefined;hp?:number | undefined;mileage?:number | undefined;transmission?:string | undefined;sizeType?:'shoe'|'clothing' | undefined};
export type Business={id:string;name:string;category:string;city:string;area:string;tier:'street'|'casual'|'luxury';rating:number;products:Product[];tag:string;image?:string | undefined};
export const cities=['Abuja','Lagos','Port Harcourt','Enugu','Delta','Ibadan','Kano','Benin','Calabar','BS Island'];
export const categories=[
 {id:'restaurants',name:'Restaurants',sub:'From street bites to fine dining',image:restaurantImg,icon:'UtensilsCrossed',count:24},
 {id:'car-dealerships',name:'Car Dealerships',sub:'Your next statement on wheels',image:carsImg,icon:'CarFront',count:12},
 {id:'boutiques',name:'Boutiques',sub:'Streetwear. Native drip. Luxury.',image:boutiqueImg,icon:'Shirt',count:18},
 {id:'jewelry',name:'Jewelry & Watches',sub:'A little shine. A lot of presence.',image:jewelryImg,icon:'Gem',count:8},
 {id:'bars-lounges',name:'Bars & Lounges',sub:'Good nights, great company',image:barsImg,icon:'Wine',count:16},
 {id:'salons',name:'Salons & Grooming',sub:'Look the part. Own the room.',image:salonsImg,icon:'Scissors',count:14},
 {id:'electronics',name:'Electronics',sub:'Upgrade your everyday',image:electronicsImg,icon:'Smartphone',count:10},
 {id:'hotels',name:'Hotels & Suites',sub:'Check into something exceptional',image:hotelsImg,icon:'BedDouble',count:9},
 {id:'gyms',name:'Gyms & Fitness',sub:'Build strength. Find your rhythm.',image:gymsImg,icon:'Dumbbell',count:7},
 {id:'cinemas',name:'Cinema & Entertainment',sub:'Big screens. Bigger experiences.',image:cinemaImg,icon:'Clapperboard',count:6},
];
export const paymentMethods=['Soul Vault Direct Debit','Soul Card','Cash at Counter','Bank Transfer'];
const foodProducts:Product[]=[
 {id:'suya',name:'Premium Suya Platter',price:8500,type:'food',image:suyaImg,description:'Charcoal-grilled beef, yaji spice, onions and tomatoes'},
 {id:'egusi',name:'Egusi & Pounded Yam',price:12000,type:'food',image:egusiImg,description:'Rich melon-seed soup with assorted proteins'},
 {id:'pepper',name:'Pepper Soup Special',price:9500,type:'food',image:pepperImg,description:'Catfish pepper soup with native spices'},
 {id:'puff',name:'Puff-Puff & Zobo Combo',price:3500,type:'food',image:puffImg,description:'Golden doughnuts with chilled hibiscus drink'},
 {id:'jollof',name:'Party Jollof Feast',price:15000,type:'food',image:foodImg,description:'Smoky party jollof, chicken and plantain'},
];
const vehicles:Product[]=[
 {id:'supercar-1',name:'Ferrino F8 Tributo',price:185000000,type:'car',image:supercarImg,brand:'Ferrino',mark:'Ferrino',description:'Mid-engine V8 supercar. Pure theatre.',engine:'3.9L Twin-Turbo V8',hp:710,mileage:3200,transmission:'7-Speed DCT'},
 {id:'supercar-2',name:'Lamborati Huracan',price:210000000,type:'car',image:supercarImg,brand:'Lamborati',mark:'Lamborati',description:'Naturally aspirated V10 scream machine.',engine:'5.2L V10',hp:630,mileage:1800,transmission:'7-Speed DCT'},
 {id:'suv-1',name:'Meridian GLE 450',price:95000000,type:'car',image:suvImg,brand:'Meridian',mark:'Meridian',description:'Luxury SUV. Command the road.',engine:'3.0L Turbo I6',hp:362,mileage:8500,transmission:'9-Speed Auto'},
 {id:'suv-2',name:'Royale Range Rover',price:145000000,type:'car',image:suvImg,brand:'Royale',mark:'Royale',description:'The ultimate luxury SUV.',engine:'3.0L Supercharged',hp:395,mileage:4200,transmission:'8-Speed Auto'},
 {id:'sedan-1',name:'Bavaria 530i',price:48000000,type:'car',image:sedanImg,brand:'Bavaria',mark:'Bavaria',description:'Executive sedan. Quiet power.',engine:'2.0L Turbo',hp:248,mileage:12000,transmission:'8-Speed Auto'},
 {id:'sedan-2',name:'Lexora ES 350',price:42000000,type:'car',image:sedanImg,brand:'Lexora',mark:'Lexora',description:'Refined comfort. Everyday luxury.',engine:'3.5L V6',hp:302,mileage:9500,transmission:'8-Speed Auto'},
 {id:'sedan-3',name:'Hyundae Sonata',price:18500000,type:'car',image:sedanImg,brand:'Hyundae',mark:'Hyundae',description:'Smart sedan for the modern driver.',engine:'2.5L I4',hp:191,mileage:15000,transmission:'8-Speed Auto'},
 {id:'sedan-4',name:'Hondo Accord',price:22000000,type:'car',image:sedanImg,brand:'Hondo',mark:'Hondo',description:'Reliable. Refined. Ready.',engine:'1.5L Turbo',hp:192,mileage:11000,transmission:'CVT'},
];
const fashion:Product[]=[
 {id:'shoe-1',name:'Nyke Air Force 1',price:85000,type:'fashion',image:shoeImg,brand:'Nyke',mark:'Nyke',description:'Classic white leather sneakers',sizeType:'shoe'},
 {id:'shoe-2',name:'Adira Samba',price:72000,type:'fashion',image:shoeImg,brand:'Adira',mark:'Adira',description:'Gum sole street classic',sizeType:'shoe'},
 {id:'apparel-1',name:'Guci Oversized Tee',price:145000,type:'fashion',image:apparelImg,brand:'Guci',mark:'Guci',description:'Premium cotton, statement logo',sizeType:'clothing'},
 {id:'apparel-2',name:'Louis Vaton Hoodie',price:320000,type:'fashion',image:apparelImg,brand:'Louis Vaton',mark:'Louis Vaton',description:'Heavyweight fleece luxury hoodie',sizeType:'clothing'},
 {id:'bag-1',name:'Hermez Birkin Style',price:2800000,type:'fashion',image:bagImg,brand:'Hermez',mark:'Hermez',description:'Iconic structured leather tote'},
 {id:'watch-1',name:'Rolux Submariner',price:4500000,type:'fashion',image:watchImg,brand:'Rolux',mark:'Rolux',description:'Dive watch. Status symbol.'},
 {id:'watch-2',name:'Omegaa Seamaster',price:3200000,type:'fashion',image:watchImg,brand:'Omegaa',mark:'Omegaa',description:'Precision Swiss movement'},
];
const general:Product[]=[
 {id:'drinks-1',name:'Champagne Tower Set',price:450000,type:'general',image:drinksImg,description:'Celebration-ready bottle service package'},
 {id:'drinks-2',name:'Premium Whiskey Flight',price:185000,type:'general',image:drinksImg,description:'Curated tasting of rare blends'},
 {id:'cinema-1',name:'VIP Cinema Ticket',price:25000,type:'general',image:cinemaImg,description:'Recliner seat, free popcorn and drink'},
 {id:'cinema-2',name:'Private Screening',price:350000,type:'general',image:cinemaImg,description:'Book the whole theatre for your crew'},
];
const menus:Record<string,Product[]>={
 restaurants:foodProducts,
 'car-dealerships':vehicles,
 boutiques:fashion.filter(p=>p.type==='fashion'&&p.sizeType),
 jewelry:fashion.filter(p=>p.id.startsWith('watch')||p.id.startsWith('bag')),
 'bars-lounges':general.filter(p=>p.id.startsWith('drinks')),
 salons:[{id:'cut-1',name:'Signature Cut & Style',price:25000,type:'general',description:'Premium grooming session'},{id:'cut-2',name:'Full Grooming Package',price:65000,type:'general',description:'Cut, beard, facial and scalp treatment'}],
 electronics:[{id:'phone-1',name:'Smart Flagship Phone',price:850000,type:'general',description:'Latest generation device'},{id:'laptop-1',name:'Ultrabook Pro',price:1200000,type:'general',description:'Lightweight powerhouse'}],
 hotels:[{id:'suite-1',name:'Executive Suite Night',price:180000,type:'general',description:'King bed, city view, breakfast'},{id:'suite-2',name:'Presidential Suite Weekend',price:950000,type:'general',description:'Two nights, butler service'}],
 gyms:[{id:'gym-1',name:'Monthly Membership',price:45000,type:'general',description:'Full gym access + classes'},{id:'gym-2',name:'Personal Training Pack',price:120000,type:'general',description:'8 sessions with elite coach'}],
 cinemas:general.filter(p=>p.id.startsWith('cinema')),
};
const names:Record<string,string[]>={
 restaurants:['The Capital Table','Lagoon House','Ember & Oak','Street Kitchen'],
 'car-dealerships':['Prestige Motors','Auto Luxe','City Wheels','Drive Hub'],
 boutiques:['Thread & Co','Drip House','Native Atelier','Radiant'],
 jewelry:['Luxe Time','Shine Vault','Crown Jewels','Gold Standard'],
 'bars-lounges':['Skyline Bar','The After Hours','Velvet Room','Neon Lounge'],
 salons:['Fade Masters','Glam Studio','Barber Republic','Silk & Shears'],
 electronics:['Tech Arcade','Gadget Hub','Pixel Store','Circuit City'],
 hotels:['The Grand Stay','Sky Suites','Harbour Hotel','Palace Residences'],
 gyms:['Iron Temple','Pulse Fitness','Form Lab','Strength District'],
 cinemas:['Silver Screen','Cinema Royale','Popcorn Palace','Night Reel'],
};
const areas:Record<string,string[]>={
 Abuja:['Maitama','Asokoro','Wuse II','Gwarinpa','Jabi'],
 Lagos:['Victoria Island','Lekki','Ikeja','Ikoyi','Surulere'],
 'Port Harcourt':['GRA','Old GRA','Trans Amadi','Rumuola'],
 Enugu:['Independence Layout','New Haven','GRA','Coal Camp'],
 Delta:['Asaba','Warri','Effurun'],
 Ibadan:['Bodija','Ring Road','UI Area','Jericho'],
 Kano:['Nassarawa','Bompai','Sabon Gari'],
 Benin:['GRA','Ring Road','Ugbowo'],
 Calabar:['Marian','State Housing','Calabar South'],
 'BS Island':['North Shore','Marina District','Palm Grove'],
};
const regionalFood:Record<string,[string,string]>= {
 Abuja:['Capital Suya & Masa','Grilled beef, fluffy masa and yaji'], Lagos:['Lagoon Seafood Rice','Smoky rice, prawns and plantain'],
 'Port Harcourt':['Garden City Bole & Fish','Roasted plantain, grilled fish and pepper sauce'],Enugu:['Coal City Abacha','Cassava salad, garden eggs and ugba'],
 Delta:['Delta Banga & Starch','Palm fruit soup and smooth starch'],Ibadan:['Bodija Amala & Gbegiri','Amala, bean soup and ewedu'],
 Kano:['Bompai Masa & Suya','Rice cakes, beef and northern spices'],Benin:['Royal City Owo & Yam','Traditional soup and tender boiled yam'],
 Calabar:['Marian Edikang Ikong','Leafy vegetable soup and pounded yam'],'BS Island':['Island Seafood Tasting Feast','Private-chef seafood and seasonal vegetables']
};
export function cityCatalog(city:string):Business[]{
 if(!cities.includes(city))return [];
 const locations=areas[city]??[];
 const regional=regionalFood[city];
 return categories.flatMap(cat=>(names[cat.id]??[]).map((base,i)=>{
 const venueFood=foodProducts.map(p=>regional&&p.id==='egusi'?{...p,name:regional[0],description:regional[1]}:p);
 const localName=cat.id==='restaurants'&&i===3&&city!=='Abuja'&&city!=='Lagos'?`${locations[0]??city} Kitchen`:base;
 const venueName=cat.id==='car-dealerships'?`${city} ${base}`:localName==='Radiant'&&city==='Lagos'?'Radiant Ikeja':`${localName} ${city}`;
 return {id:`${cat.id}-${i+1}`,name:venueName,category:cat.id,city,area:locations[i%locations.length]??city,
 tier:(cat.id==='restaurants'?(i===2||i===3?'street':i===1?'casual':'luxury'):i===2||i===3?'street':i===1?'casual':'luxury') as Business['tier'],rating:4.9-i*.1,
 products:cat.id==='restaurants'?venueFood:cat.id==='car-dealerships'&&i===2?vehicles.slice(-4):menus[cat.id]??[],
 tag:i===0?'DISTRICT SELECT':i===1?'LOCAL FAVORITE':'STREET ESSENTIAL',image:cat.image};
 }));
}
export function findBusiness(city:string,category:string,id:string){return cityCatalog(city).find(b=>b.category===category&&b.id===id);}

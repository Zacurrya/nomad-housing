import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

const cities = [
  // Europe
  { name: 'London', country: 'United Kingdom', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBza3lsaW5lfGVufDF8fHx8MTc2MjY2NzQ0OXww&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Lisbon', country: 'Portugal', imageUrl: 'https://images.unsplash.com/photo-1536663815808-535e2280d2c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXNib24lMjBwb3J0dWdhbHxlbnwxfHx8fDE3NjI2ODg4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Barcelona', country: 'Spain', imageUrl: 'https://images.unsplash.com/photo-1593368858664-a7fe556ab936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBzcGFpbnxlbnwxfHx8fDE3NjI2ODg4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Amsterdam', country: 'Netherlands', imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Berlin', country: 'Germany', imageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Paris', country: 'France', imageUrl: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470' },
  { name: 'Porto', country: 'Portugal', imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Nice', country: 'France', imageUrl: 'https://images.unsplash.com/photo-1570633231339-5e99ce07b8eb?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200' },
  { name: 'Prague', country: 'Czech Republic', imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Budapest', country: 'Hungary', imageUrl: 'https://images.unsplash.com/photo-1578005077431-ae6d90ba4c48?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170' },
  { name: 'Tallinn', country: 'Estonia', imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200' },
  { name: 'Krakow', country: 'Poland', imageUrl: 'https://images.unsplash.com/photo-1613969498763-86b647bc7527?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200' },
  { name: 'Athens', country: 'Greece', imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Rome', country: 'Italy', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Vienna', country: 'Austria', imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Edinburgh', country: 'Scotland', imageUrl: 'https://images.unsplash.com/photo-1720375061021-11217da5499d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774' },

  // Asia
  { name: 'Bangkok', country: 'Thailand', imageUrl: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5na29rJTIwc2t5bGluZXxlbnwxfHx8fDE3NjI2ODg4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Saigon', country: 'Vietnam', imageUrl: 'https://images.unsplash.com/photo-1536086845112-89de23aa4772?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470' },
  { name: 'Tokyo', country: 'Japan', imageUrl: 'https://images.unsplash.com/photo-1549693578-d683be217e58?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200' },
  { name: 'Dubai', country: 'United Arab Emirates', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreWxpbmV8ZW58MXx8fHwxNzYyNjA1MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Singapore', country: 'Singapore', imageUrl: 'https://images.unsplash.com/photo-1702893165989-8ec6c7ddfba7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1632' },
  { name: 'Osaka', country: 'Japan', imageUrl: 'https://images.unsplash.com/photo-1731338634914-a22509394cf2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1472' },
  { name: 'Chiang Mai', country: 'Thailand', imageUrl: 'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Shenzhen', country: 'China', imageUrl: 'https://images.unsplash.com/photo-1659079992080-be171a869271?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470' },
  { name: 'Seoul', country: 'South Korea', imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1470' },
  { name: 'Shanghai', country: 'China', imageUrl: 'https://images.unsplash.com/photo-1537266484881-de6a40fba897?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1200' },
  { name: 'Koh Samui', country: 'Thailand', imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Bali', country: 'Indonesia', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Tehran', country: 'Iran', imageUrl: 'https://images.unsplash.com/photo-1564150736927-1e6f48e1b89d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200' },
  { name: 'Kyoto', country: 'Japan', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },

  // North America
  { name: 'New York', country: 'United States', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Chicago', country: 'United States', imageUrl: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170' },
  { name: 'Miami', country: 'United States', imageUrl: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Austin', country: 'United States', imageUrl: 'https://images.unsplash.com/photo-1603007588138-971e6d56e223?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200' },
  { name: 'Tulum', country: 'Mexico', imageUrl: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },

  // South America
  { name: 'Buenos Aires', country: 'Argentina', imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Sao Paulo', country: 'Brazil', imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170' },
  { name: 'Rio de Janeiro', country: 'Brazil', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170' },
  { name: 'Medellín', country: 'Colombia', imageUrl: 'https://images.unsplash.com/photo-1512250431446-d0b4b57b27ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMGNvbG9tYmlhfGVufDF8fHx8MTc2MjY4ODg1Nnww&ixlib=rb-4.1.0&q=80&w=1080' },

  // Oceania
  { name: 'Melbourne', country: 'Australia', imageUrl: 'https://images.unsplash.com/photo-1545044846-351ba102b6d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Sydney', country: 'Australia', imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },

  // Africa
  { name: 'Cairo', country: 'Egypt', imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Cape Town', country: 'South Africa', imageUrl: 'https://images.unsplash.com/photo-1505765052242-0a3fa2b8f1f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
];

// Real property/apartment listing images from Unsplash (optimized for Next.js)
const propertyImages = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1585412727110-e4e93d71d4ea?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1588854337221-4cf9fa96e6e9?w=1200&auto=format&fit=crop&q=80',
];

const amenitiesList = [
  'WiFi', 'Air Conditioning', 'Heating', 'Washer', 'Dryer', 'Kitchen',
  'Parking', 'Elevator', 'Pool', 'Gym', 'Balcony', 'Garden',
  'Pet Friendly', 'Wheelchair Accessible', 'Dishwasher', 'TV',
  'Workspace', 'Fireplace', 'Security System', 'Concierge'
];

const propertyTitles = [
  'Modern Downtown Loft', 'Cozy Studio Apartment', 'Luxury Penthouse Suite',
  'Charming Victorian House', 'Spacious Family Home', 'Contemporary Condo',
  'Historic Townhouse', 'Beachfront Villa', 'Mountain View Retreat',
  'Urban Industrial Loft', 'Garden Apartment', 'Riverside Residence',
  'Minimalist Studio', 'Executive Apartment', 'Artist Loft Space',
  'Renovated Warehouse Unit', 'Boutique Apartment', 'Sky-High Penthouse',
  'Vintage Character Home', 'Smart Home Condo', 'Eco-Friendly House',
  'Designer Apartment', 'Rooftop Terrace Suite', 'Converted Loft',
  'Premium City Apartment', 'Tranquil Garden Home', 'Metropolitan Studio'
];

const descriptions = [
  'Beautiful space with natural light and modern amenities in a prime location.',
  'Perfectly located for city living with easy access to transport and dining.',
  'Stunning views and high-end finishes throughout this exceptional property.',
  'Newly renovated with designer touches and premium appliances.',
  'A rare find in the heart of the city with character and charm.',
  'Open concept living space ideal for entertaining and relaxation.',
  'Quiet neighborhood setting while being close to all urban conveniences.',
  'Sleek and sophisticated design meets functional living space.',
  'Light-filled interior with thoughtful layout and quality fixtures.',
  'Exceptional property offering comfort, style, and convenience.'
];

const districts = {
  'London': ['Shoreditch', 'Camden', 'Kensington', 'Chelsea', 'Notting Hill'],
  'Paris': ['Le Marais', 'Montmartre', 'Saint-Germain', 'Bastille', 'Belleville'],
  'Barcelona': ['Gothic Quarter', 'Eixample', 'Gràcia', 'El Born', 'Barceloneta'],
  'Amsterdam': ['Jordaan', 'De Pijp', 'Oud-West', 'Centrum', 'Noord'],
  'Berlin': ['Kreuzberg', 'Mitte', 'Prenzlauer Berg', 'Friedrichshain', 'Charlottenburg'],
  'Tokyo': ['Shibuya', 'Shinjuku', 'Harajuku', 'Roppongi', 'Ginza'],
  'Bangkok': ['Sukhumvit', 'Silom', 'Sathorn', 'Thonglor', 'Ari'],
  'Lisbon': ['Alfama', 'Bairro Alto', 'Chiado', 'Belém', 'Príncipe Real'],
  'New York': ['Manhattan', 'Brooklyn', 'Queens', 'Williamsburg', 'SoHo'],
  'Dubai': ['Downtown', 'Marina', 'JBR', 'Business Bay', 'Palm Jumeirah']
};

// Realistic monthly rental prices in USD (stored in cents) by city
// Ranges account for property size, quality, and location within the city
const cityPriceRanges: Record<string, { min: number; max: number }> = {
  // Very Expensive Cities (Tier 1)
  'New York': { min: 2000, max: 8000 },      // $2,000-$8,000
  'Dubai': { min: 1500, max: 6000 },         // $1,500-$6,000
  'Singapore': { min: 1800, max: 7000 },     // $1,800-$7,000
  'Tokyo': { min: 1200, max: 5000 },         // $1,200-$5,000
  'London': { min: 1800, max: 7000 },        // $1,800-$7,000
  'Paris': { min: 1500, max: 6000 },         // $1,500-$6,000

  // Expensive Cities (Tier 2)
  'Amsterdam': { min: 1400, max: 5000 },     // $1,400-$5,000
  'Sydney': { min: 1500, max: 5500 },        // $1,500-$5,500
  'Melbourne': { min: 1300, max: 4800 },     // $1,300-$4,800
  'Seoul': { min: 1100, max: 4500 },         // $1,100-$4,500
  'Osaka': { min: 1000, max: 4000 },         // $1,000-$4,000
  'Chicago': { min: 1200, max: 4500 },       // $1,200-$4,500
  'Miami': { min: 1400, max: 5000 },         // $1,400-$5,000
  'Vienna': { min: 1100, max: 4000 },        // $1,100-$4,000

  // Moderate to Expensive (Tier 3)
  'Barcelona': { min: 1000, max: 3500 },     // $1,000-$3,500
  'Berlin': { min: 900, max: 3200 },         // $900-$3,200
  'Rome': { min: 950, max: 3500 },           // $950-$3,500
  'Edinburgh': { min: 900, max: 3200 },      // $900-$3,200
  'Kyoto': { min: 850, max: 3000 },          // $850-$3,000
  'Austin': { min: 1100, max: 4000 },        // $1,100-$4,000

  // Affordable to Moderate (Tier 4)
  'Lisbon': { min: 800, max: 2800 },         // $800-$2,800
  'Porto': { min: 700, max: 2500 },          // $700-$2,500
  'Prague': { min: 750, max: 2600 },         // $750-$2,600
  'Budapest': { min: 600, max: 2200 },       // $600-$2,200
  'Athens': { min: 650, max: 2300 },         // $650-$2,300
  'Krakow': { min: 550, max: 2000 },         // $550-$2,000
  'Tallinn': { min: 600, max: 2200 },        // $600-$2,200

  // Affordable Cities (Tier 5)
  'Bangkok': { min: 400, max: 2000 },        // $400-$2,000
  'Chiang Mai': { min: 300, max: 1500 },     // $300-$1,500
  'Saigon': { min: 350, max: 1800 },         // $350-$1,800
  'Bali': { min: 350, max: 1800 },           // $350-$1,800
  'Koh Samui': { min: 400, max: 2000 },      // $400-$2,000
  'Medellín': { min: 400, max: 1800 },       // $400-$1,800
  'Buenos Aires': { min: 450, max: 2000 },   // $450-$2,000
  'Cairo': { min: 300, max: 1500 },          // $300-$1,500
  'Tehran': { min: 250, max: 1400 },         // $250-$1,400

  // Major South American Cities
  'Sao Paulo': { min: 600, max: 2500 },      // $600-$2,500
  'Rio de Janeiro': { min: 650, max: 2800 }, // $650-$2,800

  // Other Asian Cities
  'Shanghai': { min: 900, max: 3500 },       // $900-$3,500
  'Shenzhen': { min: 850, max: 3200 },       // $850-$3,200

  // Beach/Resort Towns
  'Tulum': { min: 800, max: 3000 },          // $800-$3,000
  'Nice': { min: 1200, max: 4500 },          // $1,200-$4,500
  'Cape Town': { min: 600, max: 2500 },      // $600-$2,500

  // Default for cities not listed
  'default': { min: 600, max: 2500 }         // $600-$2,500
};

function getPriceRange(cityName: string): { min: number; max: number } {
  return cityPriceRanges[cityName] || cityPriceRanges['default'];
}

function generateRealisticPrice(cityName: string, beds: number, area: number): number {
  const baseRange = getPriceRange(cityName);

  // Base price from city range
  const basePrice = baseRange.min + Math.random() * (baseRange.max - baseRange.min);

  // Adjust for number of bedrooms (more beds = higher price)
  const bedroomMultiplier = 0.7 + (beds * 0.3); // 1 bed: 1x, 2 bed: 1.3x, 3 bed: 1.6x, 4 bed: 1.9x

  // Adjust for area (larger = more expensive)
  const areaMultiplier = 0.8 + (area / 200); // 40sqm: 1x, 100sqm: 1.3x, 140sqm: 1.5x

  const finalPrice = basePrice * bedroomMultiplier * areaMultiplier;

  // Round to nearest $50
  return Math.round(finalPrice / 50) * 50;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateListingId(index: number): string {
  return `listing-${String(index).padStart(4, '0')}`;
}

async function main() {
  console.log('Start seeding cities...');

  for (const city of cities) {
    const result = await prisma.city.upsert({
      where: { name: city.name },
      update: {
        country: city.country,
        imageUrl: city.imageUrl,
      },
      create: city,
    });
    console.log(`Upserted city: ${result.name}`);
  }

  console.log('\nStart seeding amenities...');
  const createdAmenities = [];
  for (const amenity of amenitiesList) {
    const result = await prisma.amenity.upsert({
      where: { name: amenity },
      update: {},
      create: { name: amenity },
    });
    createdAmenities.push(result);
    console.log(`Upserted amenity: ${result.name}`);
  }

  console.log('\nStart seeding locations...');
  const locations = [];

  // Create locations for cities with districts
  for (const [cityName, cityDistricts] of Object.entries(districts)) {
    const cityData = cities.find(c => c.name === cityName);
    if (!cityData) continue;

    for (const district of cityDistricts) {
      const location = await prisma.location.upsert({
        where: {
          district_city_country: {
            district,
            city: cityName,
            country: cityData.country
          }
        },
        update: {},
        create: {
          district,
          city: cityName,
          country: cityData.country
        }
      });
      locations.push(location);
      console.log(`Upserted location: ${district}, ${cityName}`);
    }
  }

  // Create additional locations without specific districts for variety
  const citiesWithoutDistricts = cities.filter(c => !Object.keys(districts).includes(c.name));
  for (const city of citiesWithoutDistricts.slice(0, 10)) {
    const location = await prisma.location.upsert({
      where: {
        district_city_country: {
          district: 'City Center',
          city: city.name,
          country: city.country
        }
      },
      update: {},
      create: {
        district: 'City Center',
        city: city.name,
        country: city.country
      }
    });
    locations.push(location);
    console.log(`Upserted location: City Center, ${city.name}`);
  }

  console.log('\nStart seeding listings...');

  for (let i = 1; i <= 100; i++) {
    const location = getRandomItem(locations);
    const title = getRandomItem(propertyTitles);
    const description = getRandomItem(descriptions);
    const beds = Math.floor(Math.random() * 4) + 1; // 1-4 beds
    const baths = Math.floor(Math.random() * 3) + 1; // 1-3 baths
    const area = Math.floor(Math.random() * 100) + 40; // 40-140 sqm

    // Generate realistic rental price based on city, beds, and area
    const rentalPrice = generateRealisticPrice(location.city, beds, area);
    const purchasePrice = rentalPrice * (Math.floor(Math.random() * 100) + 200); // Roughly 200-300x monthly rent
    const deposit = Math.floor(rentalPrice * (Math.random() * 0.5 + 1)); // 1-1.5x rent
    const featured = Math.random() > 0.85; // 15% featured
    const sold = Math.random() > 0.9; // 10% sold

    // Select 2-4 random images
    const imageCount = Math.floor(Math.random() * 3) + 2;
    const selectedImages = getRandomItems(propertyImages, imageCount);

    // Select 3-8 random amenities
    const amenityCount = Math.floor(Math.random() * 6) + 3;
    const selectedAmenities = getRandomItems(createdAmenities, amenityCount);

    const listing = await prisma.listing.create({
      data: {
        id: generateListingId(i),
        title: `${title} ${i}`,
        description,
        source: 'seed',
        originalUrl: `https://example.com/listing/${i}`,
        sold,
        rentalPrice,
        purchasePrice,
        deposit,
        beds,
        baths,
        area,
        featured,
        viewCount: Math.floor(Math.random() * 500),
        locationId: location.id,
        images: {
          create: selectedImages.map((url, idx) => ({
            url,
            altText: `${title} - Image ${idx + 1}`
          }))
        },
        amenities: {
          connect: selectedAmenities.map(a => ({ id: a.id }))
        }
      }
    });

    console.log(`Created listing ${i}/100: ${listing.title} in ${location.city}`);
  }

  console.log('\nSeeding finished successfully!');
  console.log(`Total: ${cities.length} cities, ${locations.length} locations, 100 listings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

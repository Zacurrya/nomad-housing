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
  { name: 'Nice', country: 'France', imageUrl: 'https://images.unsplash.com/photo-1570633231339-5e99ce07b8eb?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Prague', country: 'Czech Republic', imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Budapest', country: 'Hungary', imageUrl: 'https://images.unsplash.com/photo-1578005077431-ae6d90ba4c48?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170' },
  { name: 'Tallinn', country: 'Estonia', imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Krakow', country: 'Poland', imageUrl: 'https://images.unsplash.com/photo-1613969498763-86b647bc7527?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Athens', country: 'Greece', imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Rome', country: 'Italy', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Vienna', country: 'Austria', imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Edinburgh', country: 'Scotland', imageUrl: 'https://images.unsplash.com/photo-1720375061021-11217da5499d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774' },

  // Asia
  { name: 'Bangkok', country: 'Thailand', imageUrl: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5na29rJTIwc2t5bGluZXxlbnwxfHx8fDE3NjI2ODg4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Saigon', country: 'Vietnam', imageUrl: 'https://images.unsplash.com/photo-1536086845112-89de23aa4772?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470' },
  { name: 'Tokyo', country: 'Japan', imageUrl: 'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Dubai', country: 'United Arab Emirates', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreWxpbmV8ZW58MXx8fHwxNzYyNjA1MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Singapore', country: 'Singapore', imageUrl: 'https://images.unsplash.com/photo-1702893165989-8ec6c7ddfba7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1632' },
  { name: 'Osaka', country: 'Japan', imageUrl: 'https://images.unsplash.com/photo-1731338634914-a22509394cf2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1472' },
  { name: 'Chiang Mai', country: 'Thailand', imageUrl: 'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Shenzhen', country: 'China', imageUrl: 'https://images.unsplash.com/photo-1659079992080-be171a869271?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470' },
  { name: 'Seoul', country: 'South Korea', imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1470' },
  { name: 'Shanghai', country: 'China', imageUrl: 'https://images.unsplash.com/photo-1537266484881-de6a40fba897?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1470' },
  { name: 'Koh Samui', country: 'Thailand', imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Bali', country: 'Indonesia', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Tehran', country: 'Iran', imageUrl: 'https://images.unsplash.com/photo-1564150736927-1e6f48e1b89d?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Kyoto', country: 'Japan', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },

  // North America
  { name: 'New York', country: 'United States', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Chicago', country: 'United States', imageUrl: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170' },
  { name: 'Miami', country: 'United States', imageUrl: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
  { name: 'Austin', country: 'United States', imageUrl: 'https://images.unsplash.com/photo-1603007588138-971e6d56e223?q=80&w=1200&auto=format&fit=crop' },
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
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

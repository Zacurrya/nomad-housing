import sys
import os

# Add parent directory to path to import Prisma client
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from lib.generated.prisma import Prisma
import asyncio

async def fetch_cities():
    prisma = Prisma()
    await prisma.connect()
    
    try:
        cities = await prisma.city.find_many(
            order={'country': 'asc', 'name': 'asc'}
        )
        
        # Group by country
        country_dict = {}
        for city in cities:
            if city.country not in country_dict:
                country_dict[city.country] = []
            country_dict[city.country].append(city.name)
        
        print("AVAILABLE_CITIES = [")
        for city in cities:
            print(f'    "{city.name}",')
        print("]\n")
        
        print("COUNTRY_MAPPING = {")
        for country, city_list in sorted(country_dict.items()):
            print(f'    "{country}": {city_list},')
        print("}")
        
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(fetch_cities())

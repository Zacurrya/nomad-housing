"""
Example usage of the OpenRent scraper
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.scrapers.openrent_scraper import OpenRentScraper

# Create scraper instance
scraper = OpenRentScraper()

# Example 1: Search for 2-bedroom properties in London under £2000/month
print("Example 1: 2-bed properties in London under £2000/month")
print("-" * 80)
listings = scraper.scrape_listings(
    city="London",
    bedrooms=2,
    max_price=2000,
    max_results=10
)
scraper.display_listings(listings)

print("\n" + "="*80 + "\n")

# Example 2: Search for any property in Manchester with postcode area
print("Example 2: Properties in Manchester M4 area")
print("-" * 80)
listings = scraper.scrape_listings(
    city="Manchester",
    postcode="M4",
    max_results=10
)
scraper.display_listings(listings)

print("\n" + "="*80 + "\n")

# Example 3: Search for flats in Birmingham between £800-£1200
print("Example 3: Flats in Birmingham between £800-£1200")
print("-" * 80)
listings = scraper.scrape_listings(
    city="Birmingham",
    property_type="flat",
    min_price=800,
    max_price=1200,
    max_results=10
)
scraper.display_listings(listings)

# Export results
if listings:
    scraper.export_to_json(listings, "birmingham_flats.json")

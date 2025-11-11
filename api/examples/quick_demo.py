"""
Quick demo of the OpenRent scraper with various search parameters
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.scrapers.openrent_scraper import OpenRentScraper

# Create scraper instance
scraper = OpenRentScraper(headless=True)

print("="*80)
print("OpenRent Property Scraper - Quick Demo")
print("="*80)

# Example 1: Search for properties in Manchester with 1 bedroom
print("\n\nExample 1: 1-bedroom properties in Manchester")
print("-" * 80)
listings = scraper.scrape_listings(
    city="Manchester",
    bedrooms=1,
    max_results=5
)
scraper.display_listings(listings)

# Example 2: Search with price range
print("\n\n" + "="*80)
print("Example 2: Properties in Birmingham between £800-£1200")
print("-" * 80)
listings = scraper.scrape_listings(
    city="Birmingham",
    min_price=800,
    max_price=1200,
    max_results=5
)
scraper.display_listings(listings)

# Export to JSON
if listings:
    scraper.export_to_json(listings, "birmingham_listings.json")

print("\n\n✓ Demo complete!")

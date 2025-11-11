"""
Simple test of the OpenRent scraper
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.scrapers.openrent_scraper import OpenRentScraper

def test_scraper():
    """Test the scraper with a simple search"""
    print("Testing OpenRent Scraper...")
    print("="*80)
    
    # Create scraper instance
    scraper = OpenRentScraper()
    
    # Test search for properties in London
    print("\nSearching for 2-bedroom properties in London...")
    listings = scraper.scrape_listings(
        city="London",
        bedrooms=2,
        max_results=5  # Just get 5 for testing
    )
    
    # Display results
    scraper.display_listings(listings)
    
    if listings:
        print("\n✓ Scraper is working correctly!")
        print(f"✓ Found {len(listings)} listings")
    else:
        print("\n⚠ No listings found. This might be due to:")
        print("  - Network issues")
        print("  - OpenRent's HTML structure has changed")
        print("  - No properties match the search criteria")

if __name__ == "__main__":
    test_scraper()

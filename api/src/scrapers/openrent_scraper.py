"""
OpenRent Property Scraper

This module provides functionality to scrape property listings from OpenRent
based on user-specified search parameters.

Note: OpenRent loads properties dynamically with JavaScript, so this scraper
uses Selenium WebDriver to properly render the page.
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from typing import Optional, List, Dict
from dataclasses import dataclass
import time
import json
import sys


@dataclass
class PropertyListing:
    """Data class to store property listing information"""
    title: str
    price: str
    location: str
    bedrooms: str
    property_type: str
    url: str
    description: str = ""
    available_date: str = ""
    images: List[Dict[str, str]] = None  # List of image objects for Next.js
    
    def __post_init__(self):
        """Initialize images list if not provided"""
        if self.images is None:
            self.images = []


class OpenRentScraper:
    """Scraper for OpenRent property listings using Selenium"""
    
    BASE_URL = "https://www.openrent.com"
    
    def __init__(self, headless: bool = True):
        """
        Initialize the scraper
        
        Args:
            headless: Run browser in headless mode (no visible window)
        """
        self.headless = headless
        self.driver = None
    
    def _init_driver(self):
        """Initialize the Selenium WebDriver with performance optimizations"""
        if self.driver is None:
            chrome_options = Options()
            if self.headless:
                chrome_options.add_argument('--headless')
            
            # Performance optimizations
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-extensions')
            chrome_options.add_argument('--disable-software-rasterizer')
            chrome_options.add_argument('--disable-images')  # Don't load images
            chrome_options.add_argument('--blink-settings=imagesEnabled=false')
            chrome_options.add_argument('--disable-javascript-harmony')
            chrome_options.add_argument('--disable-notifications')
            chrome_options.add_argument('--disable-popup-blocking')
            chrome_options.add_argument('--disable-infobars')
            chrome_options.add_argument('--window-size=1920,1080')
            chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
            
            # Disable unnecessary features
            chrome_options.add_experimental_option('excludeSwitches', ['enable-logging', 'enable-automation'])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            
            # Set page load strategy to 'eager' - don't wait for all resources
            chrome_options.page_load_strategy = 'eager'
            
            # Additional performance preferences
            prefs = {
                'profile.default_content_setting_values': {
                    'images': 2,  # Disable images
                    'plugins': 2,
                    'popups': 2,
                    'geolocation': 2,
                    'notifications': 2,
                    'media_stream': 2,
                }
            }
            chrome_options.add_experimental_option('prefs', prefs)
            
            try:
                # Use webdriver-manager to automatically download and manage ChromeDriver
                service = Service(ChromeDriverManager().install())
                self.driver = webdriver.Chrome(service=service, options=chrome_options)
                
                # Set shorter timeouts
                self.driver.set_page_load_timeout(10)
                self.driver.implicitly_wait(2)
            except Exception as e:
                print(f"Error initializing Chrome driver: {e}")
                print("\nPlease ensure Chrome browser is installed on your system.")
                raise
    
    def __del__(self):
        """Cleanup: close the browser"""
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass
    
    def build_search_url(
        self,
        city: str,
        bedrooms: Optional[int] = None,
        min_price: Optional[int] = None,
        max_price: Optional[int] = None,
        postcode: Optional[str] = None,
        property_type: Optional[str] = None
    ) -> str:
        """
        Build the OpenRent search URL with parameters
        
        Args:
            city: City name (e.g., 'London', 'Manchester')
            bedrooms: Number of bedrooms
            min_price: Minimum monthly rent
            max_price: Maximum monthly rent
            postcode: Postcode or area
            property_type: Type of property (e.g., 'flat', 'house')
            
        Returns:
            Complete search URL
        """
        # Start with base search URL
        search_location = postcode if postcode else city
        url = f"{self.BASE_URL}/properties-to-rent/{search_location.lower().replace(' ', '-')}"
        
        # Build query parameters
        params = []
        
        if bedrooms is not None:
            params.append(f"bedrooms={bedrooms}")
        
        if min_price is not None:
            params.append(f"prices_min={min_price}")
        
        if max_price is not None:
            params.append(f"prices_max={max_price}")
        
        if property_type:
            params.append(f"term={property_type}")
        
        # Append parameters to URL
        if params:
            url += "?" + "&".join(params)
        
        return url
    
    def scrape_listings(
        self,
        city: str,
        bedrooms: Optional[int] = None,
        min_price: Optional[int] = None,
        max_price: Optional[int] = None,
        postcode: Optional[str] = None,
        property_type: Optional[str] = None,
        max_results: int = 10
    ) -> List[PropertyListing]:
        """
        Scrape property listings from OpenRent
        
        Args:
            city: City name
            bedrooms: Number of bedrooms
            min_price: Minimum monthly rent
            max_price: Maximum monthly rent
            postcode: Postcode or area
            property_type: Type of property
            max_results: Maximum number of results to return (default: 10)
            
        Returns:
            List of PropertyListing objects
        """
        url = self.build_search_url(
            city=city,
            bedrooms=bedrooms,
            min_price=min_price,
            max_price=max_price,
            postcode=postcode,
            property_type=property_type
        )
        
        print(f"Searching: {url}")
        
        try:
            # Initialize driver if not already done
            self._init_driver()
            
            # Load the page
            self.driver.get(url)
            
            # Wait for property listings with reduced timeout
            wait = WebDriverWait(self.driver, 8)  # Reduced from 15 to 8 seconds
            
            # Wait specifically for 'pli' class which is what OpenRent uses
            try:
                wait.until(EC.presence_of_element_located((By.CLASS_NAME, "pli")))
            except TimeoutException:
                print("⚠ Timeout waiting for properties to load")
            
            # Reduced wait time from 2 to 0.5 seconds
            time.sleep(0.5)
            
            # Get the page source after JavaScript has executed
            page_source = self.driver.page_source
            soup = BeautifulSoup(page_source, 'html.parser')
            
        except Exception as e:
            print(f"Error loading page: {e}")
            return []
        
        listings = []
        
        # OpenRent uses <a> tags with class="pli" for property listings
        # The href is just the listing ID like "/2686976"
        property_cards = soup.find_all('a', class_='pli')
        
        print(f"Found {len(property_cards)} property listings")
        
        if not property_cards:
            print("No property listings found with expected structure")
            return []
        
        # Process property cards
        for card in property_cards[:max_results]:
            try:
                href = card.get('href', '')
                if not href:
                    continue
                
                listing = self._parse_listing_card(card, href)
                if listing:
                    listings.append(listing)
            except Exception as e:
                print(f"Error parsing listing: {e}")
                continue
        
        return listings
    
    def _parse_listing_card(self, card, href: str = "") -> Optional[PropertyListing]:
        """Parse a single property listing card (OpenRent's pli format)"""
        try:
            # Extract URL
            if not href:
                href = card.get('href', '')
            
            url = self.BASE_URL + href if href and not href.startswith('http') else href
            
            # Extract title from the alt text of the property image
            img = card.find('img', class_='propertyPic')
            title = img.get('alt', 'Property Listing') if img else "Property Listing"
            
            # Extract info div which contains price, location, bedrooms, etc.
            info_div = card.find('div', class_='listing-info')
            
            if not info_div:
                # Fallback: try to get text from the whole card
                return None
            
            # Extract price - usually has £ symbol
            price = "Price not listed"
            price_elem = info_div.find(class_=lambda x: x and 'price' in str(x).lower())
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                # Extract just the monthly price
                import re
                # Try to find price with "per month" or "per week"
                price_match = re.search(r'£[\d,]+\s*per\s*month', price_text)
                if price_match:
                    # Format nicely with space
                    price = re.sub(r'(£[\d,]+)\s*per\s*month', r'\1 per month', price_match.group(0))
                else:
                    price_match = re.search(r'£[\d,]+\s*per\s*week', price_text)
                    if price_match:
                        price = re.sub(r'(£[\d,]+)\s*per\s*week', r'\1 per week', price_match.group(0))
                    else:
                        # Just get the first price
                        price_match = re.search(r'£[\d,]+', price_text)
                        if price_match:
                            price = price_match.group(0) + " pcm"
            else:
                # Look for text containing £
                for text in info_div.stripped_strings:
                    if '£' in text:
                        import re
                        price_match = re.search(r'£[\d,]+', text)
                        if price_match:
                            price = price_match.group(0) + " pcm"
                        break
            
            # Extract title/description from listing-title class
            title_elem = info_div.find(class_='listing-title')
            if title_elem:
                title_text = title_elem.get_text(strip=True)
                if title_text:
                    title = title_text
            
            # Extract location from listing-desc class
            location = "Location not specified"
            desc_elem = info_div.find(class_='listing-desc')
            if desc_elem:
                location = desc_elem.get_text(strip=True)
            
            # Extract bedrooms and property type from title
            bedrooms = "N/A"
            prop_type = "N/A"
            
            # Parse title like "1 Bed Flat, Whitehall, SW1A"
            if title:
                parts = title.lower()
                if 'bed' in parts:
                    # Extract number of bedrooms
                    import re
                    bed_match = re.search(r'(\d+)\s*bed', parts)
                    if bed_match:
                        bedrooms = f"{bed_match.group(1)} bed"
                
                # Extract property type
                if 'flat' in parts:
                    prop_type = "Flat"
                elif 'house' in parts:
                    prop_type = "House"
                elif 'studio' in parts:
                    prop_type = "Studio"
                    bedrooms = "Studio"
                elif 'apartment' in parts:
                    prop_type = "Apartment"
            
            # Extract description (if available)
            description = location if location != "Location not specified" else ""
            
            # Extract available date (if present)
            available_date = ""
            avail_elem = card.find(class_=lambda x: x and 'available' in str(x).lower())
            if avail_elem:
                available_date = avail_elem.get_text(strip=True)
            
            # Extract images for Next.js <Image> component
            images = []
            
            # Find the main property image
            img = card.find('img', class_='propertyPic')
            if img:
                img_src = img.get('src', '')
                # OpenRent often uses data-src for lazy loading
                if not img_src or img_src.startswith('data:'):
                    img_src = img.get('data-src', '')
                
                if img_src and not img_src.startswith('data:'):
                    # Make sure URL is absolute
                    if img_src.startswith('//'):
                        img_src = 'https:' + img_src
                    elif img_src.startswith('/'):
                        img_src = self.BASE_URL + img_src
                    
                    # Format for Next.js Image component
                    images.append({
                        'src': img_src,
                        'alt': title,
                        'width': 800,  # Default width, adjust as needed
                        'height': 600  # Default height, adjust as needed
                    })
            
            # Try to find additional images (some listings have multiple)
            all_imgs = card.find_all('img')
            for img in all_imgs:
                if 'propertyPic' in img.get('class', []):
                    continue  # Already processed
                
                img_src = img.get('src', '') or img.get('data-src', '')
                if img_src and not img_src.startswith('data:'):
                    # Make sure URL is absolute
                    if img_src.startswith('//'):
                        img_src = 'https:' + img_src
                    elif img_src.startswith('/'):
                        img_src = self.BASE_URL + img_src
                    
                    # Avoid duplicates
                    if not any(image['src'] == img_src for image in images):
                        images.append({
                            'src': img_src,
                            'alt': f"{title} - Additional image",
                            'width': 800,
                            'height': 600
                        })
            
            return PropertyListing(
                title=title,
                price=price,
                location=location,
                bedrooms=bedrooms,
                property_type=prop_type,
                url=url,
                description=description[:200] if description else "",
                available_date=available_date,
                images=images
            )
        except Exception as e:
            print(f"Error parsing card: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def display_listings(self, listings: List[PropertyListing]) -> None:
        """Display property listings in a formatted way"""
        if not listings:
            print("\nNo listings found.")
            return
        
        print(f"\n{'='*80}")
        print(f"Found {len(listings)} listings:")
        print(f"{'='*80}\n")
        
        for i, listing in enumerate(listings, 1):
            print(f"{i}. {listing.title}")
            print(f"   Price: {listing.price}")
            print(f"   Location: {listing.location}")
            print(f"   Bedrooms: {listing.bedrooms}")
            print(f"   Property Type: {listing.property_type}")
            if listing.available_date:
                print(f"   Available: {listing.available_date}")
            print(f"   URL: {listing.url}")
            if listing.description:
                print(f"   Description: {listing.description[:100]}...")
            print(f"   {'-'*78}")
    
    def export_to_json(self, listings: List[PropertyListing], filename: str = "listings.json") -> None:
        """Export listings to JSON file"""
        data = [
            {
                'title': listing.title,
                'price': listing.price,
                'location': listing.location,
                'bedrooms': listing.bedrooms,
                'property_type': listing.property_type,
                'url': listing.url,
                'description': listing.description,
                'available_date': listing.available_date,
                'images': listing.images
            }
            for listing in listings
        ]
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"\nListings exported to {filename}")


def main():
    """Main function to run the scraper interactively"""
    scraper = OpenRentScraper()
    
    print("="*80)
    print("OpenRent Property Scraper")
    print("="*80)
    
    # Get user input
    city = input("\nEnter city (e.g., London, Manchester): ").strip()
    
    bedrooms_input = input("Enter number of bedrooms (leave blank for any): ").strip()
    bedrooms = int(bedrooms_input) if bedrooms_input else None
    
    min_price_input = input("Enter minimum price per month (leave blank for no minimum): ").strip()
    min_price = int(min_price_input) if min_price_input else None
    
    max_price_input = input("Enter maximum price per month (leave blank for no maximum): ").strip()
    max_price = int(max_price_input) if max_price_input else None
    
    postcode = input("Enter postcode/area (leave blank to search by city only): ").strip() or None
    
    property_type = input("Enter property type (e.g., flat, house) (leave blank for any): ").strip() or None
    
    max_results_input = input("Enter max number of results (default 10): ").strip()
    max_results = int(max_results_input) if max_results_input else 10
    
    print("\nSearching for properties...")
    
    # Perform search
    listings = scraper.scrape_listings(
        city=city,
        bedrooms=bedrooms,
        min_price=min_price,
        max_price=max_price,
        postcode=postcode,
        property_type=property_type,
        max_results=max_results
    )
    
    # Display results
    scraper.display_listings(listings)
    
    # Ask if user wants to export
    if listings:
        export = input("\nWould you like to export results to JSON? (y/n): ").strip().lower()
        if export == 'y':
            filename = input("Enter filename (default: listings.json): ").strip() or "listings.json"
            scraper.export_to_json(listings, filename)


if __name__ == "__main__":
    main()

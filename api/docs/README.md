# OpenRent Web Scraper

A Python web scraper that allows users to search and retrieve property listings from OpenRent with customizable parameters. Uses Selenium WebDriver to handle JavaScript-rendered content.

## Features

- 🔍 Search properties by city, postcode, or area
- 🛏️ Filter by number of bedrooms
- 💰 Set minimum and maximum price ranges
- 🏠 Filter by property type (flat, house, etc.)
- 📊 Get top 10 (or custom number) of listings
- 💾 Export results to JSON format
- 🖥️ Interactive command-line interface
- 📝 Programmatic API for integration
- 🤖 Uses Selenium for reliable JavaScript rendering

## Installation

1. **Install the required dependencies:**

```bash
pip install -r requirements.txt
```

2. **Ensure Chrome browser is installed** on your system (ChromeDriver will be auto-managed)

## Usage

### Interactive Mode

Run the scraper interactively with prompts:

```bash
python openrent_scraper.py
```

You'll be prompted to enter:
- City name (e.g., London, Manchester, Birmingham)
- Number of bedrooms (optional)
- Minimum price per month (optional)
- Maximum price per month (optional)
- Postcode/area (optional)
- Property type (optional)
- Maximum number of results (default: 10)

### Programmatic Usage

Use the scraper in your own Python code:

```python
from openrent_scraper import OpenRentScraper

# Create scraper instance (headless=True means no browser window)
scraper = OpenRentScraper(headless=True)

# Search for properties
listings = scraper.scrape_listings(
    city="London",
    bedrooms=2,
    min_price=1000,
    max_price=2000,
    postcode="SW1",  # Optional
    property_type="flat",  # Optional
    max_results=10
)

# Display results
scraper.display_listings(listings)

# Export to JSON
scraper.export_to_json(listings, "my_listings.json")
```

## API Reference

### OpenRentScraper Class

#### Methods

##### `scrape_listings()`

Main method to scrape property listings.

**Parameters:**
- `city` (str): City name (required)
- `bedrooms` (int, optional): Number of bedrooms
- `min_price` (int, optional): Minimum monthly rent
- `max_price` (int, optional): Maximum monthly rent
- `postcode` (str, optional): Postcode or area
- `property_type` (str, optional): Type of property (e.g., 'flat', 'house')
- `max_results` (int, optional): Maximum number of results (default: 10)

**Returns:** List of PropertyListing objects

##### `display_listings(listings)`

Display property listings in formatted output.

**Parameters:**
- `listings` (List[PropertyListing]): List of property listings

##### `export_to_json(listings, filename)`

Export listings to JSON file.

**Parameters:**
- `listings` (List[PropertyListing]): List of property listings
- `filename` (str, optional): Output filename (default: "listings.json")

### PropertyListing Dataclass

Each property listing contains:
- `title` (str): Property title
- `price` (str): Monthly rent
- `location` (str): Property location
- `bedrooms` (str): Number of bedrooms
- `property_type` (str): Type of property
- `url` (str): Full URL to the listing
- `description` (str): Property description
- `available_date` (str): When the property becomes available

## Examples

See `example_usage.py` for more detailed examples:

```bash
python example_usage.py
```

### Example 1: 2-bedroom properties in London under £2000/month

```python
listings = scraper.scrape_listings(
    city="London",
    bedrooms=2,
    max_price=2000,
    max_results=10
)
```

### Example 2: Any property in Manchester M4 area

```python
listings = scraper.scrape_listings(
    city="Manchester",
    postcode="M4",
    max_results=10
)
```

### Example 3: Flats in Birmingham between £800-£1200

```python
listings = scraper.scrape_listings(
    city="Birmingham",
    property_type="flat",
    min_price=800,
    max_price=1200,
    max_results=10
)
```

## Output Format

### Console Output

```
================================================================================
Found 10 listings:
================================================================================

1. 2 Bed Flat in Central London
   Price: £1,800 pcm
   Location: Westminster, London
   Bedrooms: 2
   Property Type: Flat
   Available: Available now
   URL: https://www.openrent.com/property/...
   Description: Beautiful 2-bedroom flat in the heart of Westminster...
   ------------------------------------------------------------------------------
```

### JSON Export

```json
[
  {
    "title": "2 Bed Flat in Central London",
    "price": "£1,800 pcm",
    "location": "Westminster, London",
    "bedrooms": "2",
    "property_type": "Flat",
    "url": "https://www.openrent.com/property/...",
    "description": "Beautiful 2-bedroom flat...",
    "available_date": "Available now"
  }
]
```

## Important Notes

⚠️ **Web Scraping Considerations:**

1. **Respect OpenRent's Terms of Service**: Always review and comply with the website's terms of service and robots.txt
2. **Rate Limiting**: The scraper includes delays to avoid overwhelming the server
3. **HTML Structure Changes**: OpenRent may update their website structure, which could break the scraper
4. **Use Responsibly**: Don't make excessive requests; consider using OpenRent's official API if available

## Troubleshooting

### No listings found
- Check your search parameters (city name spelling, price range, etc.)
- The area might not have properties matching your criteria
- OpenRent's HTML structure may have changed

### Connection errors
- Check your internet connection
- The website might be temporarily unavailable
- You might be rate-limited (wait a few minutes)

## License

This project is for educational purposes only. Please respect OpenRent's terms of service.

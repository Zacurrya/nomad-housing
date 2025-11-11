# OpenRent Web Scraper - Usage Guide

## ✅ Setup Complete!

Your OpenRent web scraper is ready to use! Here's how to get started.

## Quick Start

### Option 1: Run Test (Verify Everything Works)
```bash
python test.py
```

### Option 2: Interactive Mode (Easiest)
```bash
python openrent_scraper.py
```
Follow the prompts to search for properties.

### Option 3: Quick Demo (See Multiple Examples)
```bash
python quick_demo.py
```

### Option 4: Use in Your Code
```python
from openrent_scraper import OpenRentScraper

scraper = OpenRentScraper(headless=True)  # Set False to see browser

listings = scraper.scrape_listings(
    city="London",
    bedrooms=2,
    max_price=2000,
    max_results=10
)

scraper.display_listings(listings)
scraper.export_to_json(listings, "results.json")
```

## Search Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `city` | str | City name (required) | "London", "Manchester" |
| `bedrooms` | int | Number of bedrooms | 1, 2, 3 |
| `min_price` | int | Minimum monthly rent | 800, 1000 |
| `max_price` | int | Maximum monthly rent | 2000, 3000 |
| `postcode` | str | Postcode or area | "SW1", "M4" |
| `property_type` | str | Type of property | "flat", "house" |
| `max_results` | int | Max number of results | 10, 20 |

## Output Format

Each listing contains:
- **title**: Property title (e.g., "2 Bed Flat, Central London")
- **price**: Monthly rent (e.g., "£1,800 per month")
- **location**: Property location/description
- **bedrooms**: Number of bedrooms (e.g., "2 bed")
- **property_type**: Type (Flat, House, Studio)
- **url**: Direct link to the listing
- **description**: Property description
- **available_date**: When available

## Examples

### Example 1: Simple Search
```python
# Search for any properties in Manchester
listings = scraper.scrape_listings(city="Manchester", max_results=10)
```

### Example 2: Filtered Search
```python
# 2-bed flats in London under £2000
listings = scraper.scrape_listings(
    city="London",
    bedrooms=2,
    max_price=2000,
    property_type="flat"
)
```

### Example 3: Specific Area
```python
# Properties in Birmingham B1 area
listings = scraper.scrape_listings(
    city="Birmingham",
    postcode="B1",
    min_price=800,
    max_price=1200
)
```

### Example 4: Export Results
```python
listings = scraper.scrape_listings(city="Edinburgh", max_results=20)
scraper.export_to_json(listings, "edinburgh_properties.json")
```

## Tips

1. **Headless Mode**: Set `headless=True` (default) to run without opening a browser window
2. **Browser Window**: Set `headless=False` to see the browser in action (useful for debugging)
3. **Rate Limiting**: The scraper automatically handles page loading times
4. **Results**: Default is 10 results, but you can request more with `max_results`
5. **No Results?**: Try broader search criteria (remove filters, different city)

## Troubleshooting

### "No listings found"
- Check your search parameters (city spelling, price range)
- Try a broader search (remove bedrooms or price filters)
- Some areas might not have properties matching your criteria

### Chrome/ChromeDriver Issues
- Ensure Chrome browser is installed
- The script will auto-download the correct ChromeDriver version

### Slow Performance
- This is normal! Selenium loads real web pages
- First run downloads ChromeDriver (one-time)
- Subsequent runs are faster

## File Structure

```
Real-Estate-API/
├── openrent_scraper.py      # Main scraper module
├── test.py                  # Simple test script
├── quick_demo.py            # Demo with multiple examples
├── example_usage.py         # More example code
├── requirements.txt         # Python dependencies
├── README.md               # Full documentation
└── USAGE_GUIDE.md          # This file
```

## Need Help?

Run the test script to verify everything works:
```bash
python test.py
```

If you see "✓ Scraper is working correctly!" - you're all set! 🎉

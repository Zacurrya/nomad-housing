# OpenRent API - Usage Examples

## Starting the API

```bash
python api.py
```

The API will start on `http://localhost:5000`

## API Endpoints

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "OpenRent API is running"
}
```

### 2. Search Properties

**Base URL:** `GET http://localhost:5000/api/properties`

#### Parameters:
- `city` (required) - City name
- `bedrooms` (optional) - Number of bedrooms
- `min_price` (optional) - Minimum monthly rent
- `max_price` (optional) - Maximum monthly rent
- `postcode` (optional) - Postcode or area
- `property_type` (optional) - Type of property
- `max_results` (optional) - Max results (default: 10, max: 50)

## Examples

### Example 1: Simple Search (London)
```bash
curl "http://localhost:5000/api/properties?city=London&max_results=5"
```

### Example 2: Search with Bedrooms Filter
```bash
curl "http://localhost:5000/api/properties?city=Manchester&bedrooms=2&max_results=10"
```

### Example 3: Search with Price Range
```bash
curl "http://localhost:5000/api/properties?city=Birmingham&min_price=800&max_price=1200&max_results=5"
```

### Example 4: Search with All Filters
```bash
curl "http://localhost:5000/api/properties?city=London&bedrooms=1&min_price=1000&max_price=2000&property_type=flat&max_results=10"
```

### Example 5: Search by Postcode
```bash
curl "http://localhost:5000/api/properties?city=London&postcode=SW1&max_results=5"
```

## PowerShell Examples

### Simple Search
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/properties?city=London&max_results=5"
```

### Search with Filters
```powershell
$params = @{
    city = "Manchester"
    bedrooms = 2
    max_price = 2000
    max_results = 10
}
$uri = "http://localhost:5000/api/properties?" + (($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join "&")
Invoke-RestMethod -Uri $uri | ConvertTo-Json -Depth 10
```

## Python Example

```python
import requests

# Search for properties
response = requests.get('http://localhost:5000/api/properties', params={
    'city': 'London',
    'bedrooms': 2,
    'max_price': 2000,
    'max_results': 10
})

data = response.json()

if data['success']:
    print(f"Found {data['count']} listings")
    for listing in data['listings']:
        print(f"{listing['title']} - {listing['price']}")
        print(f"  URL: {listing['url']}")
else:
    print(f"Error: {data['error']}")
```

## JavaScript (Node.js) Example

```javascript
const fetch = require('node-fetch');

async function searchProperties() {
    const params = new URLSearchParams({
        city: 'London',
        bedrooms: 2,
        max_price: 2000,
        max_results: 10
    });
    
    const response = await fetch(`http://localhost:5000/api/properties?${params}`);
    const data = await response.json();
    
    if (data.success) {
        console.log(`Found ${data.count} listings`);
        data.listings.forEach(listing => {
            console.log(`${listing.title} - ${listing.price}`);
            console.log(`  URL: ${listing.url}`);
        });
    } else {
        console.error(`Error: ${data.error}`);
    }
}

searchProperties();
```

## Response Format

### Success Response
```json
{
  "success": true,
  "count": 5,
  "query": {
    "city": "London",
    "bedrooms": 2,
    "min_price": null,
    "max_price": 2000,
    "postcode": null,
    "property_type": null,
    "max_results": 5
  },
  "listings": [
    {
      "title": "2 Bed Flat, Central London",
      "price": "£1,800 per month",
      "location": "Westminster, London",
      "bedrooms": "2 bed",
      "property_type": "Flat",
      "url": "https://www.openrent.com/123456",
      "description": "Beautiful 2-bedroom flat...",
      "available_date": "Available now"
    }
  ]
}
```

### Error Response
```json
{
  "success": false,
  "error": "Missing required parameter: city",
  "example": "/api/properties?city=London&bedrooms=2&max_price=2000"
}
```

## Testing

Run the test suite:
```bash
python test_api.py
```

## Notes

- First request may take longer (initializing browser)
- Subsequent requests are faster
- API runs on port 5000 by default
- Use `max_results` wisely to avoid long wait times
- The scraper runs in headless mode (no visible browser)

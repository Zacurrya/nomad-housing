# OpenRent Property Scraper - REST API

## 🎉 Complete! Your API is ready to use!

I've successfully converted the OpenRent scraper into a RESTful API that returns JSON objects.

## 📁 Project Structure

```
Real-Estate-API/
├── api.py                    # Flask REST API server ⭐ NEW
├── openrent_scraper.py       # Core scraper module
├── test_api.py              # API test suite ⭐ NEW
├── demo_api.py              # API demo with examples ⭐ NEW
├── API_EXAMPLES.md          # API usage examples ⭐ NEW
├── requirements.txt         # Python dependencies (updated)
├── test.py                  # Scraper test
├── quick_demo.py            # Scraper demo
├── example_usage.py         # Scraper examples
├── README.md               # Original documentation
└── USAGE_GUIDE.md          # Usage guide
```

## 🚀 Quick Start

### 1. Start the API Server

```bash
python api.py
```

The server will start on `http://localhost:5000`

### 2. Make Your First Request

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/properties?city=London&bedrooms=2&max_results=5"
```

**Python:**
```python
import requests

response = requests.get('http://localhost:5000/api/properties', params={
    'city': 'London',
    'bedrooms': 2,
    'max_results': 5
})

data = response.json()
print(f"Found {data['count']} listings")
```

**cURL:**
```bash
curl "http://localhost:5000/api/properties?city=London&bedrooms=2&max_results=5"
```

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

Returns server status.

**Response:**
```json
{
  "status": "ok",
  "message": "OpenRent API is running"
}
```

### Search Properties
```
GET /api/properties
```

Search for rental properties with filters.

**Required Parameters:**
- `city` - City name (e.g., "London", "Manchester")

**Optional Parameters:**
- `bedrooms` - Number of bedrooms (integer)
- `min_price` - Minimum monthly rent (integer)
- `max_price` - Maximum monthly rent (integer)
- `postcode` - Postcode or area (string)
- `property_type` - Type of property (string, e.g., "flat", "house")
- `max_results` - Maximum results (integer, default: 10, max: 50)

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "query": {
    "city": "London",
    "bedrooms": 2,
    "min_price": null,
    "max_price": 2000,
    "postcode": null,
    "property_type": null,
    "max_results": 3
  },
  "listings": [
    {
      "title": "2 Bed Flat, Westminster, SW1A",
      "price": "£2,800 per month",
      "location": "Beautiful flat in central London",
      "bedrooms": "2 bed",
      "property_type": "Flat",
      "url": "https://www.openrent.com/2686976",
      "description": "Beautiful flat in central London...",
      "available_date": "Available now"
    }
  ]
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Missing required parameter: city",
  "example": "/api/properties?city=London&bedrooms=2&max_price=2000"
}
```

## 💡 Usage Examples

### Example 1: Simple Search
```python
import requests

response = requests.get('http://localhost:5000/api/properties', params={
    'city': 'London',
    'max_results': 10
})

data = response.json()

if data['success']:
    for listing in data['listings']:
        print(f"{listing['title']} - {listing['price']}")
```

### Example 2: Filtered Search
```python
import requests

response = requests.get('http://localhost:5000/api/properties', params={
    'city': 'Manchester',
    'bedrooms': 2,
    'min_price': 800,
    'max_price': 1500,
    'property_type': 'flat',
    'max_results': 10
})

data = response.json()
print(f"Found {data['count']} matching properties")
```

### Example 3: PowerShell
```powershell
$params = @{
    city = "Birmingham"
    bedrooms = 1
    max_price = 1000
    max_results = 5
}

$uri = "http://localhost:5000/api/properties?" + (($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join "&")

$result = Invoke-RestMethod -Uri $uri
$result.listings | ForEach-Object {
    Write-Host "$($_.title) - $($_.price)"
}
```

### Example 4: JavaScript/Node.js
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
        });
    }
}

searchProperties();
```

## 🧪 Testing

### View API Demo
```bash
python demo_api.py
```

This shows example requests and responses without starting the server.

### Run Full Test Suite
1. Start the API in one terminal:
   ```bash
   python api.py
   ```

2. Run tests in another terminal:
   ```bash
   python test_api.py
   ```

## 📊 Response Format

Each property listing contains:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Property title (e.g., "2 Bed Flat, Central London") |
| `price` | string | Monthly rent (e.g., "£1,800 per month") |
| `location` | string | Property location/description |
| `bedrooms` | string | Number of bedrooms (e.g., "2 bed", "Studio") |
| `property_type` | string | Type of property (Flat, House, Studio) |
| `url` | string | Direct link to the OpenRent listing |
| `description` | string | Property description (truncated to 200 chars) |
| `available_date` | string | When the property becomes available |

## ⚙️ Configuration

The API runs on:
- **Host:** `0.0.0.0` (accessible from all network interfaces)
- **Port:** `5000`
- **Debug Mode:** Enabled (for development)

To change these settings, edit `api.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

## 🔒 Production Deployment

For production use, consider:

1. **Use a production WSGI server** (like Gunicorn or uWSGI)
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 api:app
   ```

2. **Add rate limiting** to prevent abuse

3. **Set up HTTPS** with a reverse proxy (nginx, Apache)

4. **Disable debug mode** in production

5. **Add authentication** if needed

## 🐛 Troubleshooting

### API won't start
- Ensure Flask is installed: `pip install flask flask-cors`
- Check if port 5000 is already in use

### Slow responses
- First request initializes the browser (takes longer)
- Reduce `max_results` for faster responses
- Consider implementing caching

### No listings returned
- Check search parameters
- Try broader criteria (remove filters)
- The area might have no matching properties

## 📝 Notes

- API uses Selenium with headless Chrome
- First request may take 10-15 seconds (browser initialization)
- Subsequent requests are faster
- Browser is automatically cleaned up after each request
- Maximum 50 results per request to prevent timeout

## 📖 Additional Resources

- **API_EXAMPLES.md** - More usage examples with cURL, PowerShell, Python
- **README.md** - Original scraper documentation
- **USAGE_GUIDE.md** - Quick start guide for the scraper

## 🎯 Summary

Your OpenRent scraper is now a fully functional REST API that:

✅ Returns JSON objects for easy integration  
✅ Supports all search parameters (city, bedrooms, price, etc.)  
✅ Includes proper error handling  
✅ Has comprehensive documentation and examples  
✅ Can be easily integrated into any application  

Start the server with `python api.py` and you're ready to go! 🚀

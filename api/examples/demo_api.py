"""
Simple API demo - shows the API working with example requests
This simulates what the API would return
"""

import json

def demo_health_check():
    """Demo: Health check endpoint"""
    print("\n" + "="*80)
    print("Example 1: Health Check")
    print("="*80)
    print("\nRequest: GET http://localhost:5000/api/health")
    print("\nResponse:")
    response = {
        "status": "ok",
        "message": "OpenRent API is running"
    }
    print(json.dumps(response, indent=2))


def demo_simple_search():
    """Demo: Simple property search"""
    print("\n" + "="*80)
    print("Example 2: Search Properties in London")
    print("="*80)
    print("\nRequest: GET http://localhost:5000/api/properties?city=London&max_results=3")
    print("\nResponse:")
    response = {
        "success": True,
        "count": 3,
        "query": {
            "city": "London",
            "bedrooms": None,
            "min_price": None,
            "max_price": None,
            "postcode": None,
            "property_type": None,
            "max_results": 3
        },
        "listings": [
            {
                "title": "2 Bed Flat, Westminster, SW1A",
                "price": "£2,800 per month",
                "location": "Beautiful flat in central London near Westminster",
                "bedrooms": "2 bed",
                "property_type": "Flat",
                "url": "https://www.openrent.com/2686976",
                "description": "Beautiful flat in central London near Westminster...",
                "available_date": "Available now"
            },
            {
                "title": "1 Bed Flat, Shoreditch, E1",
                "price": "£1,600 per month",
                "location": "Modern apartment in trendy Shoreditch",
                "bedrooms": "1 bed",
                "property_type": "Flat",
                "url": "https://www.openrent.com/2672999",
                "description": "Modern apartment in trendy Shoreditch...",
                "available_date": "Available from 01/12/2025"
            },
            {
                "title": "Studio Flat, King's Cross, WC1",
                "price": "£1,200 per month",
                "location": "Cozy studio near King's Cross station",
                "bedrooms": "Studio",
                "property_type": "Studio",
                "url": "https://www.openrent.com/2261139",
                "description": "Cozy studio near King's Cross station...",
                "available_date": "Available now"
            }
        ]
    }
    print(json.dumps(response, indent=2))


def demo_filtered_search():
    """Demo: Search with filters"""
    print("\n" + "="*80)
    print("Example 3: Search with Filters (Manchester, 2 beds, max £1500)")
    print("="*80)
    print("\nRequest: GET http://localhost:5000/api/properties?city=Manchester&bedrooms=2&max_price=1500&max_results=2")
    print("\nResponse:")
    response = {
        "success": True,
        "count": 2,
        "query": {
            "city": "Manchester",
            "bedrooms": 2,
            "min_price": None,
            "max_price": 1500,
            "postcode": None,
            "property_type": None,
            "max_results": 2
        },
        "listings": [
            {
                "title": "2 Bed Flat, Northern Quarter, M1",
                "price": "£1,400 per month",
                "location": "Stylish flat in the heart of Northern Quarter",
                "bedrooms": "2 bed",
                "property_type": "Flat",
                "url": "https://www.openrent.com/3123456",
                "description": "Stylish flat in the heart of Northern Quarter...",
                "available_date": "Available from 15/11/2025"
            },
            {
                "title": "2 Bed House, Chorlton, M21",
                "price": "£1,350 per month",
                "location": "Charming terraced house in Chorlton",
                "bedrooms": "2 bed",
                "property_type": "House",
                "url": "https://www.openrent.com/3234567",
                "description": "Charming terraced house in Chorlton...",
                "available_date": "Available now"
            }
        ]
    }
    print(json.dumps(response, indent=2))


def demo_error_response():
    """Demo: Error response"""
    print("\n" + "="*80)
    print("Example 4: Error Response (Missing Required Parameter)")
    print("="*80)
    print("\nRequest: GET http://localhost:5000/api/properties")
    print("\nResponse:")
    response = {
        "success": False,
        "error": "Missing required parameter: city",
        "example": "/api/properties?city=London&bedrooms=2&max_price=2000"
    }
    print(json.dumps(response, indent=2))


def demo_python_usage():
    """Demo: Python usage example"""
    print("\n" + "="*80)
    print("Example 5: Using the API from Python")
    print("="*80)
    print("""
import requests

# Make a request to the API
response = requests.get('http://localhost:5000/api/properties', params={
    'city': 'London',
    'bedrooms': 2,
    'max_price': 2000,
    'max_results': 5
})

# Parse the JSON response
data = response.json()

# Process the results
if data['success']:
    print(f"Found {data['count']} listings")
    
    for listing in data['listings']:
        print(f"\\n{listing['title']}")
        print(f"  Price: {listing['price']}")
        print(f"  Location: {listing['location']}")
        print(f"  URL: {listing['url']}")
else:
    print(f"Error: {data['error']}")
""")


if __name__ == "__main__":
    print("\n" + "="*80)
    print("OpenRent API - Example Responses")
    print("="*80)
    print("\nThis demonstrates what the API returns for various requests.")
    print("To actually run the API, use: python api.py")
    print()
    
    demo_health_check()
    demo_simple_search()
    demo_filtered_search()
    demo_error_response()
    demo_python_usage()
    
    print("\n" + "="*80)
    print("API Documentation")
    print("="*80)
    print("""
To start the API server:
    python api.py

To test the API:
    python test_api.py

Available endpoints:
    GET /api/health
    GET /api/properties?city=<city>&bedrooms=<num>&max_price=<price>&max_results=<num>

Required parameters:
    - city: City name (e.g., London, Manchester, Birmingham)

Optional parameters:
    - bedrooms: Number of bedrooms (integer)
    - min_price: Minimum monthly rent (integer)
    - max_price: Maximum monthly rent (integer)
    - postcode: Postcode or area (string)
    - property_type: Type of property (string)
    - max_results: Maximum results (integer, default: 10, max: 50)

For more examples, see API_EXAMPLES.md
""")
    print("="*80)

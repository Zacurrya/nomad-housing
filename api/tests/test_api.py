"""
Test script for the OpenRent API
Run the API first with: python api.py
Then run this script in another terminal
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_health():
    """Test health check endpoint"""
    print("\n" + "="*80)
    print("Testing Health Check Endpoint")
    print("="*80)
    
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


def test_search_simple():
    """Test simple property search"""
    print("\n" + "="*80)
    print("Test 1: Simple Search (London, 2 bedrooms)")
    print("="*80)
    
    # -- TEST PARAMS -- 
    params = {
        'city': 'Newcastle',
        'bedrooms': 1,
        'max_results': 5
    }
    
    print(f"\nRequest: GET {BASE_URL}/api/properties")
    print(f"Parameters: {params}")
    
    response = requests.get(f"{BASE_URL}/api/properties", params=params)
    print(f"\nStatus Code: {response.status_code}")
    
    data = response.json()
    print(f"Success: {data.get('success')}")
    print(f"Count: {data.get('count')}")
    
    if data.get('listings'):
        print(f"\nFirst listing:")
        first = data['listings'][0]
        print(f"  Title: {first['title']}")
        print(f"  Price: {first['price']}")
        print(f"  Location: {first['location'][:50]}...")
        print(f"  URL: {first['url']}")


def test_search_with_price():
    """Test property search with price filter"""
    print("\n" + "="*80)
    print("Test 2: Search with Price Filter (Manchester, £800-£1200)")
    print("="*80)
    
    params = {
        'city': 'Manchester',
        'min_price': 800,
        'max_price': 1200,
        'max_results': 3
    }
    
    print(f"\nRequest: GET {BASE_URL}/api/properties")
    print(f"Parameters: {params}")
    
    response = requests.get(f"{BASE_URL}/api/properties", params=params)
    print(f"\nStatus Code: {response.status_code}")
    
    data = response.json()
    print(f"Success: {data.get('success')}")
    print(f"Count: {data.get('count')}")
    
    if data.get('listings'):
        print(f"\nListings found:")
        for i, listing in enumerate(data['listings'], 1):
            print(f"  {i}. {listing['title']} - {listing['price']}")


def test_missing_parameter():
    """Test error handling for missing required parameter"""
    print("\n" + "="*80)
    print("Test 3: Missing Required Parameter (should fail)")
    print("="*80)
    
    response = requests.get(f"{BASE_URL}/api/properties")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


def test_full_response():
    """Test and display full JSON response"""
    print("\n" + "="*80)
    print("Test 4: Full JSON Response (Birmingham, 1 bed)")
    print("="*80)
    
    params = {
        'city': 'Birmingham',
        'bedrooms': 1,
        'max_results': 2
    }
    
    response = requests.get(f"{BASE_URL}/api/properties", params=params)
    print(f"\nFull JSON Response:")
    print(json.dumps(response.json(), indent=2))


if __name__ == "__main__":
    print("\n" + "="*80)
    print("OpenRent API Test Suite")
    print("="*80)
    print("\nMake sure the API is running first:")
    print("  python api.py")
    print("\nPress Enter to start tests...")
    input()
    
    try:
        # Run tests
        test_health()
        test_search_simple()
        test_search_with_price()
        test_missing_parameter()
        test_full_response()
        
        print("\n" + "="*80)
        print("All tests completed!")
        print("="*80)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to API")
        print("Please make sure the API is running:")
        print("  python api.py")
    except Exception as e:
        print(f"\n❌ Error: {e}")

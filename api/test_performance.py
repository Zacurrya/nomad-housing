import requests
import time

# Test API performance
url = "http://127.0.0.1:5000/api/properties?city=London&bedrooms=2&max_results=3"

print("Testing optimized API performance...")
print(f"URL: {url}\n")

# First request (cold start - will initialize browser)
print("First request (cold start)...")
start_time = time.time()
response = requests.get(url)
end_time = time.time()
first_request_time = end_time - start_time

print(f"Status Code: {response.status_code}")
print(f"Time taken: {first_request_time:.2f} seconds")
print(f"Listings found: {response.json().get('count', 0)}\n")

# Second request (should use pooled browser)
print("Second request (using pooled browser)...")
start_time = time.time()
response = requests.get(url)
end_time = time.time()
second_request_time = end_time - start_time

print(f"Status Code: {response.status_code}")
print(f"Time taken: {second_request_time:.2f} seconds")
print(f"Listings found: {response.json().get('count', 0)}\n")

# Third request (should also use pooled browser)
print("Third request (using pooled browser)...")
start_time = time.time()
response = requests.get(url)
end_time = time.time()
third_request_time = end_time - start_time

print(f"Status Code: {response.status_code}")
print(f"Time taken: {third_request_time:.2f} seconds")
print(f"Listings found: {response.json().get('count', 0)}\n")

# Summary
print("=" * 60)
print("PERFORMANCE SUMMARY")
print("=" * 60)
print(f"First request (cold):    {first_request_time:.2f}s")
print(f"Second request (pooled): {second_request_time:.2f}s")
print(f"Third request (pooled):  {third_request_time:.2f}s")
print(f"\nImprovement: {((first_request_time - second_request_time) / first_request_time * 100):.1f}% faster")

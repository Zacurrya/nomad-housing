# Performance Optimizations

## Overview
The API response time has been optimized from ~60 seconds to an expected ~10-15 seconds for the first request and ~5-10 seconds for subsequent requests.

## Optimizations Implemented

### 1. Browser Instance Pooling (`src/scrapers/pool.py`)
**Problem**: Creating a new Selenium browser instance for each API request took 15-20 seconds.

**Solution**: Implemented a thread-safe scraper pool that reuses browser instances:
- Pool maintains up to 2 active browser instances
- Browsers are recycled after 300 seconds to prevent memory leaks
- Thread-safe with locking mechanism for concurrent requests

**Expected Impact**: 
- First request: Still ~15-20s (cold start)
- Subsequent requests: ~5-10s (reusing pooled browsers)

### 2. Chrome Performance Flags (`src/scrapers/openrent_scraper.py`)
**Problem**: Loading unnecessary resources (images, CSS, etc.) slowed down page rendering.

**Solution**: Added Chrome optimization flags:
```python
'--disable-images',  # Don't load images
'--blink-settings=imagesEnabled=false',  # Disable image rendering
'page_load_strategy': 'eager',  # Don't wait for all resources
```

**Expected Impact**: ~5-8 seconds improvement per request

### 3. Reduced Wait Times (`src/scrapers/openrent_scraper.py`)
**Problem**: Conservative wait times caused unnecessary delays.

**Solution**: 
- Reduced WebDriverWait timeout: 15s → 8s
- Reduced sleep after page load: 2s → 0.5s
- Set page load timeout: 10s (from unlimited)

**Expected Impact**: ~8-10 seconds improvement per request

### 4. API Integration (`src/api/routes.py`)
**Problem**: API needed to be updated to use the new scraper pool.

**Solution**:
- Import and initialize global scraper pool
- Use `pool.get_scraper()` instead of creating new instances
- Return scrapers to pool with `pool.return_scraper()` instead of quitting them

## How to Use

### Starting the API
```bash
# Activate virtual environment
.venv\Scripts\activate

# Start the API
python app.py
```

### Testing Performance
The first request will still be slower (~15-20s) as it needs to initialize a browser:
```bash
curl "http://127.0.0.1:5000/api/properties?city=London&bedrooms=2&max_results=3"
```

Subsequent requests should be much faster (~5-10s) as they reuse the pooled browser:
```bash
curl "http://127.0.0.1:5000/api/properties?city=Manchester&bedrooms=1&max_results=5"
```

### Running Performance Tests
```bash
python test_performance.py
```

This script makes 3 consecutive requests and measures the time for each, showing the performance improvement from browser pooling.

## Architecture

```
API Request → Pool.get_scraper() → [Reused Browser if available OR New Browser]
                                          ↓
                              Scrape with optimized settings
                                          ↓
                          Pool.return_scraper() → [Add back to pool]
```

## Further Optimization Ideas

If performance is still not satisfactory, consider:

1. **Caching Layer**: Cache search results for popular queries (e.g., Redis)
2. **Background Workers**: Pre-warm browser instances before requests arrive
3. **Async Processing**: Use async/await for concurrent scraping
4. **Request Queuing**: Queue requests and process them with a worker pool
5. **Pagination**: For large `max_results`, fetch in batches

## Technical Details

### Pool Configuration
- **Pool Size**: 2 browsers (configurable in `pool.py`)
- **Max Age**: 300 seconds (5 minutes) before browser recreation
- **Thread Safety**: Uses `threading.Lock()` for concurrent access

### Chrome Options
All performance-critical Chrome flags are in `openrent_scraper.py`:
- Headless mode for faster rendering
- Disabled images and unnecessary resources  
- Eager page load strategy
- Reduced wait times

### Error Handling
- Pool gracefully handles browser crashes
- Scrapers are cleaned up if pool is full
- Thread-safe operations prevent race conditions

## Monitoring

To monitor performance, check the terminal output for timing information:
```
Searching: https://www.openrent.com/...
Loading page with browser (this may take a few seconds)...
✓ Found elements with selector: pli
Found 20 property listings
127.0.0.1 - - [timestamp] "GET /api/properties?..." 200 -
```

The time between "Searching" and the "200" response code indicates the total scraping time.

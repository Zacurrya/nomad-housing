"""
Scraper Pool Manager

Manages a pool of reusable scraper instances to avoid repeated browser initialization.
"""

from typing import Optional
import time
from threading import Lock
from src.scrapers.openrent_scraper import OpenRentScraper


class ScraperPool:
    """Pool of reusable scraper instances"""
    
    def __init__(self, pool_size: int = 2, max_age: int = 300):
        """
        Initialize scraper pool
        
        Args:
            pool_size: Maximum number of scraper instances to keep
            max_age: Maximum age of a scraper in seconds before recreation
        """
        self.pool_size = pool_size
        self.max_age = max_age
        self.scrapers = []
        self.lock = Lock()
    
    def get_scraper(self) -> OpenRentScraper:
        """Get a scraper from the pool or create a new one"""
        with self.lock:
            # Clean up old scrapers
            current_time = time.time()
            self.scrapers = [
                (scraper, created_at) for scraper, created_at in self.scrapers
                if current_time - created_at < self.max_age
            ]
            
            # Reuse existing scraper if available
            if self.scrapers:
                scraper, created_at = self.scrapers.pop(0)
                return scraper
            
            # Create new scraper
            return OpenRentScraper(headless=True)
    
    def return_scraper(self, scraper: OpenRentScraper):
        """Return a scraper to the pool"""
        with self.lock:
            if len(self.scrapers) < self.pool_size:
                self.scrapers.append((scraper, time.time()))
            else:
                # Pool is full, cleanup this scraper
                try:
                    if hasattr(scraper, 'driver') and scraper.driver:
                        scraper.driver.quit()
                except:
                    pass
    
    def cleanup(self):
        """Cleanup all scrapers in the pool"""
        with self.lock:
            for scraper, _ in self.scrapers:
                try:
                    if hasattr(scraper, 'driver') and scraper.driver:
                        scraper.driver.quit()
                except:
                    pass
            self.scrapers = []


# Global scraper pool instance
_scraper_pool: Optional[ScraperPool] = None


def get_scraper_pool() -> ScraperPool:
    """Get the global scraper pool instance"""
    global _scraper_pool
    if _scraper_pool is None:
        _scraper_pool = ScraperPool(pool_size=2, max_age=300)
    return _scraper_pool

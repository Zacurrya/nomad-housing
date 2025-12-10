from typing import List, Optional
from pydantic import BaseModel, field_validator, Field
import requests

def fetch_amenities_from_db():
    """Fetch available amenities from the database via API"""
    try:
        response = requests.get('http://localhost:3000/api/amenities', timeout=2)
        if response.status_code == 200:
            return response.json()
    except:
        pass
    
    # Fallback to hardcoded list if API unavailable
    return [
        "Shared gym",
        "Shared pool",
        "Furnished",
        "Washer/Dryer",
        "Air conditioning"
    ]

# Try to fetch from DB, otherwise use fallback
AMENITIES = fetch_amenities_from_db()

class ExampleOutput(BaseModel):
    minPrice: Optional[int] = Field(None, ge=0, description="Monthly rent minimum in USD (must be non-negative)")
    maxPrice: Optional[int] = Field(None, ge=0, description="Monthly rent maximum in USD (must be non-negative)")
    bedrooms: Optional[int] = Field(None, ge=0, le=10, description="Number of bedrooms (0-10)")
    cities: List[str] = Field(default_factory=list, description="List of city names (can be multiple)")
    countries: List[str] = Field(default_factory=list, description="List of country names (can be multiple)")
    amenities: List[str] = Field(default_factory=list, description="Must be from AMENITIES list")
    locationKeywords: List[str] = Field(default_factory=list, description="Keywords for local search: beach, train, station, downtown, etc.")
    
    @field_validator('minPrice', 'maxPrice')
    @classmethod
    def validate_price(cls, v):
        if v is not None and v < 0:
            raise ValueError('Price cannot be negative')
        if v is not None and v > 100000:
            raise ValueError('Price seems unreasonably high (>$100k/month)')
        return v
    
    @field_validator('bedrooms')
    @classmethod
    def validate_bedrooms(cls, v):
        if v is not None and (v < 0 or v > 10):
            raise ValueError('Bedrooms must be between 0 and 10')
        return v
    
    @field_validator('amenities')
    @classmethod
    def validate_amenities(cls, v):
        # Filter out invalid amenities
        valid_amenities = [a for a in v if a in AMENITIES]
        return valid_amenities
    
    @field_validator('locationKeywords')
    @classmethod
    def normalize_keywords(cls, v):
        # Normalize keywords to lowercase and remove duplicates
        normalized = list(set(k.lower().strip() for k in v if k.strip()))
        return normalized
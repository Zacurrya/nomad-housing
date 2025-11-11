"""
API Routes

Flask REST API routes for the property scraper.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import sys
import os

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from src.scrapers.openrent_scraper import OpenRentScraper
from src.scrapers.pool import get_scraper_pool


def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    
    # Configuration
    app.config['MAX_RESULTS_LIMIT'] = 50
    app.config['DEFAULT_MAX_RESULTS'] = 10
    
    # Get scraper pool
    scraper_pool = get_scraper_pool()
    
    # Helper function to get scraper from pool
    def get_scraper():
        """Get a scraper from the pool"""
        return scraper_pool.get_scraper()
    
    # Helper function to return scraper to pool
    def return_scraper_to_pool(scraper):
        """Return scraper to the pool"""
        scraper_pool.return_scraper(scraper)
    
    @app.route('/', methods=['GET'])
    def index():
        """Root endpoint with API documentation"""
        return jsonify({
            'name': 'OpenRent Property Scraper API',
            'version': '1.0.0',
            'endpoints': {
                '/api/health': {
                    'method': 'GET',
                    'description': 'Health check endpoint'
                },
                '/api/properties': {
                    'method': 'GET',
                    'description': 'Search for properties',
                    'required_parameters': ['city'],
                    'optional_parameters': [
                        'bedrooms (int)',
                        'min_price (int)',
                        'max_price (int)',
                        'postcode (string)',
                        'property_type (string)',
                        'max_results (int, default: 10, max: 50)'
                    ],
                    'example': '/api/properties?city=London&bedrooms=2&max_price=2000&max_results=10'
                }
            }
        }), 200
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            'status': 'ok',
            'message': 'OpenRent API is running'
        }), 200
    
    @app.route('/api/properties', methods=['GET'])
    def search_properties():
        """
        Search for properties on OpenRent
        
        Query Parameters:
            city (required): City name (e.g., London, Manchester)
            bedrooms (optional): Number of bedrooms (integer)
            min_price (optional): Minimum monthly rent (integer)
            max_price (optional): Maximum monthly rent (integer)
            postcode (optional): Postcode or area (string)
            property_type (optional): Type of property (e.g., flat, house)
            max_results (optional): Maximum number of results (default: 10)
        
        Returns:
            JSON object with success status and listings
        """
        try:
            # Get query parameters
            city = request.args.get('city')
            
            # Validate required parameters
            if not city:
                return jsonify({
                    'success': False,
                    'error': 'Missing required parameter: city',
                    'example': '/api/properties?city=London&bedrooms=2&max_price=2000'
                }), 400
            
            # Get optional parameters
            bedrooms = request.args.get('bedrooms', type=int)
            min_price = request.args.get('min_price', type=int)
            max_price = request.args.get('max_price', type=int)
            postcode = request.args.get('postcode')
            property_type = request.args.get('property_type')
            max_results = request.args.get('max_results', 
                                          default=app.config['DEFAULT_MAX_RESULTS'], 
                                          type=int)
            
            # Validate max_results
            if max_results < 1 or max_results > app.config['MAX_RESULTS_LIMIT']:
                return jsonify({
                    'success': False,
                    'error': f'max_results must be between 1 and {app.config["MAX_RESULTS_LIMIT"]}'
                }), 400
            
            # Get scraper from pool and search
            scraper = get_scraper()
            
            try:
                listings = scraper.scrape_listings(
                    city=city,
                    bedrooms=bedrooms,
                    min_price=min_price,
                    max_price=max_price,
                    postcode=postcode,
                    property_type=property_type,
                    max_results=max_results
                )
            finally:
                # Return scraper to pool for reuse
                return_scraper_to_pool(scraper)
            
            # Convert listings to dict format
            listings_data = [
                {
                    'title': listing.title,
                    'price': listing.price,
                    'location': listing.location,
                    'bedrooms': listing.bedrooms,
                    'property_type': listing.property_type,
                    'url': listing.url,
                    'description': listing.description,
                    'available_date': listing.available_date,
                    'images': listing.images  # Image data for Next.js <Image> components
                }
                for listing in listings
            ]
            
            # Return successful response
            return jsonify({
                'success': True,
                'count': len(listings_data),
                'query': {
                    'city': city,
                    'bedrooms': bedrooms,
                    'min_price': min_price,
                    'max_price': max_price,
                    'postcode': postcode,
                    'property_type': property_type,
                    'max_results': max_results
                },
                'listings': listings_data
            }), 200
            
        except Exception as e:
            # Handle any errors
            error_trace = traceback.format_exc()
            print(f"Error: {error_trace}")
            
            return jsonify({
                'success': False,
                'error': str(e),
                'message': 'An error occurred while scraping properties'
            }), 500
    
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors"""
        return jsonify({
            'success': False,
            'error': 'Endpoint not found',
            'available_endpoints': ['/api/health', '/api/properties']
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors"""
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(error)
        }), 500
    
    return app

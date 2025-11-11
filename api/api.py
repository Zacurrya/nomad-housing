"""
Real Estate API Application

Main application entry point for the OpenRent Property Scraper API.
"""

import sys
import os

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.api.routes import create_app
from config.settings import get_config


def main():
    """Main function to run the application"""
    # Get configuration
    env = os.getenv('FLASK_ENV', 'development')
    config = get_config(env)
    
    # Create Flask app
    app = create_app()
    
    # Print startup information
    print("="*80)
    print(f"{config.API_TITLE} v{config.API_VERSION}")
    print("="*80)
    print("\nStarting server...")
    print(f"Environment: {env}")
    print(f"Debug Mode: {config.DEBUG}")
    print("\nAvailable endpoints:")
    print(f"  - GET http://{config.HOST}:{config.PORT}/api/health")
    print(f"  - GET http://{config.HOST}:{config.PORT}/api/properties")
    print("\nExample:")
    print(f"  curl 'http://{config.HOST}:{config.PORT}/api/properties?city=London&bedrooms=2&max_results=5'")
    print("\n" + "="*80)
    
    # Run the Flask app
    app.run(
        debug=config.DEBUG,
        host=config.HOST,
        port=config.PORT
    )


if __name__ == '__main__':
    main()

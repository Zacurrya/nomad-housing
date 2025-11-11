"""
Configuration Settings

Application configuration for the Real Estate API.
"""

import os


class Config:
    """Base configuration"""
    # API Settings
    API_VERSION = "1.0.0"
    API_TITLE = "OpenRent Property Scraper API"
    
    # Flask Settings
    DEBUG = os.getenv('DEBUG', 'True') == 'True'
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', 5000))
    
    # Scraper Settings
    MAX_RESULTS_LIMIT = int(os.getenv('MAX_RESULTS_LIMIT', 50))
    DEFAULT_MAX_RESULTS = int(os.getenv('DEFAULT_MAX_RESULTS', 10))
    SCRAPER_HEADLESS = os.getenv('SCRAPER_HEADLESS', 'True') == 'True'
    SCRAPER_TIMEOUT = int(os.getenv('SCRAPER_TIMEOUT', 15))
    
    # OpenRent Settings
    OPENRENT_BASE_URL = "https://www.openrent.com"


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config(env='default'):
    """Get configuration based on environment"""
    return config.get(env, config['default'])

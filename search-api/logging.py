import logging
from enum import StrEnum

LOG_FORMAT_DEBUG = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

class LogLevels(StrEnum):
    debug = 'DEBUG'
    info = 'INFO'
    warn = 'WARNING'
    error = 'ERROR'

def configure_logging(level: str = LogLevels.error) -> None:
    log_level = str(level).upper()
    log_levels = [level.value for level in LogLevels]

    if log_level not in log_levels:
        logging.basicConfig(level=LogLevels.error)
        return
    
    if log_level == LogLevels.debug:
        logging.basicConfig(level=log_level, format=LOG_FORMAT_DEBUG)

    logging.basicConfig(level=log_level)
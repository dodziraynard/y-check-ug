import logging
import sys

from .base import *

logger = logging.getLogger(__name__)

try:
    from .local_settings import *
except ImportError as e:
    logger.error(str(e))

LOGS_ROOT = BASE_DIR / "logs/"
Path(LOGS_ROOT).mkdir(parents=True, exist_ok=True)
if not DEBUG:
    LOGGING = {
        "version": 1,
        "disable_existing_loggers": True,
        "root": {
            "level": "DEBUG",
            "handlers": ["file"]
        },
        "handlers": {
            "file": {
                "level": "DEBUG",
                "class": "logging.FileHandler",
                "filename": LOGS_ROOT / "system.log",
                "formatter": "app",
            },
            'console': {
                "level": "DEBUG",
                'class': 'logging.StreamHandler',
                'stream': sys.stdout,
            }
        },
        "formatters": {
            "app": {
                "format": (u"%(asctime)s [%(levelname)-8s] "
                            "(%(module)s.%(funcName)s) %(message)s"),
                "datefmt":
                "%Y-%m-%d %H:%M:%S",
            },
        },
    }

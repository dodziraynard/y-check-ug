from .base import BASE_DIR


LOGS_ROOT = BASE_DIR / "logs/"


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s %(levelname)s %(name)s %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        }
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "standard",
            "filters": [],
        },
        "file": {
            "level": "INFO",
            "class": "logging.FileHandler",
            "filename": LOGS_ROOT / "system.log",
            "formatter": "standard",
        },
    },
    "loggers": {
        logger_name: {
            "level": "DEBUG",
            "propagate": True,
        } for logger_name in ("django", "django.request", "django.db.backends", "django.template", "ycheck")
    },
    "root": {
        "level": "DEBUG",
        "handlers": ["console", "file"],
    }
}

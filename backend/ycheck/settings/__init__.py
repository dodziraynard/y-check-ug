import logging
from .base import *
from .logging_config import *

logger = logging.getLogger(__name__)

try:
    from .local_settings import *
except ImportError as e:
    logger.error(str(e))

LOGS_ROOT = BASE_DIR / "logs/"
Path(LOGS_ROOT).mkdir(parents=True, exist_ok=True)

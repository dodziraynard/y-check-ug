import logging
from dotenv import load_dotenv
load_dotenv()

from .logging_config import *
from .base import *

logger = logging.getLogger(__name__)

try:
    from .local_settings import *
except ImportError as e:
    pass

LOGS_ROOT = BASE_DIR / "logs/"
Path(LOGS_ROOT).mkdir(parents=True, exist_ok=True)

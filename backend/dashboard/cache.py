import json
import logging
from redis import Redis
from django.conf import settings

logger = logging.getLogger(__name__)


class Cache:
    REDIS_HOST = settings.REDIS_HOST
    REDIS_PORT = settings.REDIS_PORT
    rc = Redis(host=REDIS_HOST, port=REDIS_PORT)

    @classmethod
    def get_summary_flag_key(cls, pid, study_phase):
        return "summaryflag" + pid + study_phase

    def save(self, key: str, data: dict):
        logger.info("Setting key=%s", key)
        data_string = json.dumps(data)
        self.rc.set(key, data_string, ex=3600 * 24)

    def get_cache(self, key: str):
        logger.info("Getting key=%s", key)
        data_string = self.rc.get(key)
        if data_string:
            return json.loads(data_string)

    def delete(self, key: str):
        logger.info("Deleting key=%s", key)
        if key:
            self.rc.delete(key)

    def delete_with_matching_pattern(self, key_pattern: str):
        logger.info("Deleting key_pattern=%s", key_pattern)

        for key in self.rc.scan_iter(key_pattern):
            # delete the key
            self.rc.delete(key)

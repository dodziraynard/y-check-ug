import time
import logging

from django.http import StreamingHttpResponse
from celery.result import AsyncResult
from django.views import View


logger = logging.getLogger(__name__)


class StreamTaskStatusView(View):

    def get(self, _, task_id):
        result = AsyncResult(task_id)
        self.link = "null"

        def get_task_progress():
            retry_count = 0
            while retry_count < 20:
                time.sleep(0.2)
                data = ""
                try:
                    if result.info:
                        self.link = result.info.get("link") or self.link
                        data = str(result.info.get("current", "")) + "/" + str(
                            result.info.get("total", "")) + ":- " + result.info.get("info", "")
                    if result.status == "SUCCESS":
                        yield 'data: DONE %s\n\n' % self.link
                        break
                    yield 'data: %s\n\n' % data
                except AttributeError as e:
                    yield "data: Error: Can't fetch tasks status\n\n"
                    retry_count += 1
                    logging.error("StreamTaskStatusView %s", str(e))

                except Exception as e:
                    retry_count += 1
                    logging.error("StreamTaskStatusView %s", str(e))
            yield 'data: CLOSE \n\n'
        return StreamingHttpResponse(get_task_progress(),
                                     content_type='text/event-stream')

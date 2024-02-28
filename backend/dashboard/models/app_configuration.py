from django.db import models
from .mixin import UpstreamSyncBaseModel


class AppConfiguration(UpstreamSyncBaseModel):
    android_apk = models.FileField(upload_to="apks/", null=True, blank=True)
    current_apk_versions = models.CharField(max_length=11,default="")
    
    def save(self, *args, **kwargs) -> None:
        if self.android_apk:
            version = self.android_apk.file.name.split("v")[-1].split("-")[0]
            self.current_apk_versions  = version
            return super().save(*args, **kwargs)
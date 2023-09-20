from django.contrib import admin

from dashboard.models.models import *

admin.site.register(CheckupLocation)
admin.site.register(Section)
admin.site.register(PreviousResponseRequirement)
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(AdolescentResponse)
admin.site.register(SummaryFlag)
admin.site.register(Adolescent)
admin.site.register(FlagCondition)

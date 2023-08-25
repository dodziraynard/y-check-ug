from django.contrib import admin
from .models import Adolescent, User, SecurityQuestion, SecurityQuestionAnswer


# Register your models here.
admin.site.register(User)
admin.site.register(Adolescent)
admin.site.register(SecurityQuestion)
admin.site.register(SecurityQuestionAnswer)




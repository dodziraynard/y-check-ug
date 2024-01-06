from django.contrib import admin
from .models import *

class UserAdmin(admin.ModelAdmin):
    search_fields = ['username__icontains', 'surname__icontains', 'other_names__icontains']
   
# Register your models here.
admin.site.register(User, UserAdmin)

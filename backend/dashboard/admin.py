from django.contrib import admin

from dashboard.models import *


class OptionInline(admin.TabularInline):
    model = Option


class PreviousResponseRequirementInline(admin.TabularInline):
    fk_name = "requirement_for"
    model = PreviousResponseRequirement


class FlagColorInline(admin.TabularInline):
    model = FlagColor


class FlagConditionInline(admin.TabularInline):
    model = FlagCondition


class QuestionAdmin(admin.ModelAdmin):
    search_fields = ['text__icontains', 'number', 'question_id']
    inlines = [
        OptionInline,
        PreviousResponseRequirementInline,
    ]


class FlagLabelAdmin(admin.ModelAdmin):
    inlines = [
        FlagColorInline
    ]


class FlagColorAdmin(admin.ModelAdmin):
    inlines = [
        FlagConditionInline
    ]


admin.site.register(CheckupLocation)
admin.site.register(Section)
admin.site.register(Question, QuestionAdmin)
admin.site.register(PreviousResponseRequirement)
admin.site.register(Option)
admin.site.register(AdolescentResponse)
admin.site.register(Adolescent)
admin.site.register(SummaryFlag)
admin.site.register(FlagLabel, FlagLabelAdmin)
admin.site.register(FlagColor, FlagColorAdmin)
admin.site.register(FlagCondition)
admin.site.register(Facility)
admin.site.register(Service)
admin.site.register(Treatment)

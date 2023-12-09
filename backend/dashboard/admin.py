from django.contrib import admin

from dashboard.models import *
from setup.models import MobileConfig, NodeConfig


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
    ordering = ['number']
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


class AdolescentResponseAdmin(admin.ModelAdmin):
    search_fields = ['question__text__icontains']


class AdolescentAdmin(admin.ModelAdmin):
    search_fields = ['pid', 'surname', 'other_names']


class FlagConditionAdmin(admin.ModelAdmin):
    search_fields = ['name']


admin.site.register(CheckupLocation)
admin.site.register(Section)
admin.site.register(Question, QuestionAdmin)
admin.site.register(PreviousResponseRequirement)
admin.site.register(Option)
admin.site.register(AdolescentResponse, AdolescentResponseAdmin)
admin.site.register(Adolescent, AdolescentAdmin)
admin.site.register(SummaryFlag)
admin.site.register(FlagLabel, FlagLabelAdmin)
admin.site.register(FlagColor, FlagColorAdmin)
admin.site.register(FlagCondition, FlagConditionAdmin)
admin.site.register(Facility)
admin.site.register(Service)
admin.site.register(Treatment)
admin.site.register(Referral)
admin.site.register(MobileConfig)
admin.site.register(NodeConfig)


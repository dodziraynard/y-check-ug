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


class QuestionInline(admin.TabularInline):
    model = Question


class QuestionAdmin(admin.ModelAdmin):
    search_fields = ["id", 'text__icontains', 'number', 'question_id']
    ordering = ['number']
    inlines = [
        OptionInline,
        PreviousResponseRequirementInline,
    ]


class FlagLabelAdmin(admin.ModelAdmin):
    inlines = [FlagColorInline]


class FlagColorAdmin(admin.ModelAdmin):
    search_fields = [
        "id", 'flag_label__name__icontains', 'color_name__icontains',
        'color_code__icontains'
    ]
    inlines = [FlagConditionInline]


class AdolescentResponseAdmin(admin.ModelAdmin):
    search_fields = ['question__text__icontains']


class AdolescentAdmin(admin.ModelAdmin):
    search_fields = ['pid', 'surname', 'other_names']


class FlagConditionAdmin(admin.ModelAdmin):
    search_fields = ['name']


class SummaryFlagAdmin(admin.ModelAdmin):
    search_fields = [
        'adolescent__surname__icontains', "adolescent__other_names__icontains"
    ]


class SectionAdmin(admin.ModelAdmin):
    inlines = [
        QuestionInline,
    ]


admin.site.register(CheckupLocation)
admin.site.register(Section, SectionAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(PreviousResponseRequirement)
admin.site.register(Option)
admin.site.register(AdolescentResponse, AdolescentResponseAdmin)
admin.site.register(Adolescent, AdolescentAdmin)
admin.site.register(SummaryFlag, SummaryFlagAdmin)
admin.site.register(FlagLabel, FlagLabelAdmin)
admin.site.register(FlagColor, FlagColorAdmin)
admin.site.register(FlagCondition, FlagConditionAdmin)
admin.site.register(Facility)
admin.site.register(Service)
admin.site.register(Treatment)
admin.site.register(Referral)
admin.site.register(ConditionTreatment)
admin.site.register(DeletionBackLog)
admin.site.register(QuestionGroup)
admin.site.register(MobileConfig)
admin.site.register(NodeConfig)
admin.site.register(AdolescentActivityTime)
admin.site.register(ComputedAverageActivityTime)
admin.site.register(AppConfiguration)

import logging
from rest_framework import serializers
from dashboard.models import ComputedAverageActivityTime

logger = logging.getLogger(__name__)


class ComputedAverageActivityTimeSerializer(serializers.ModelSerializer):
    average_time = serializers.SerializerMethodField()

    def get_average_time(self, obj):
        return obj.average_time_in_seconds

    class Meta:
        model = ComputedAverageActivityTime
        fields = "__all__"

import hashlib
from rest_framework import serializers
from .models import *
from django.contrib.auth.password_validation import validate_password


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'phone']
        read_only_fields = ['username']


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name',
                  'is_active', 'is_staff', 'is_superuser']


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if not value.startswith('YC'):
            raise serializers.ValidationError("Username must start with 'YC'")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class SecurityQuestionAnswerSerializer(serializers.ModelSerializer):
    security_question = serializers.PrimaryKeyRelatedField(
        queryset=SecurityQuestion.objects.all())
    answer = serializers.CharField(max_length=200)

    class Meta:
        model = SecurityQuestionAnswer
        fields = ['security_question', 'answer']

    def create(self, validated_data):
        user = self.context['request'].user
        security_question = validated_data.get('security_question')
        answer = validated_data.get('answer')

        SecurityQuestionAnswer.objects.create(
            user=user,
            security_question=security_question,
            answer=answer
        )
        return validated_data


class UserOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'phone',
                  'is_active', 'is_staff', 'is_superuser']


class SecurityQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityQuestion
        fields = ['id', 'question']


# class SecurityQuestionAnswerSerializer(serializers.ModelSerializer):
#     security_question = serializers.PrimaryKeyRelatedField(queryset=SecurityQuestion.objects.all())
#     answer = serializers.CharField(max_length=200)

#     class Meta:
#         model = SecurityQuestionAnswer
#         fields = ['security_question', 'answer']


class BasicSchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = BasicSchool
        fields = '__all__'


class SNRSchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = SNRSchool
        fields = '__all__'


class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = '__all__'


class AdolescentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adolescent
        fields = '__all__'

    """def to_representation(self, instance):
        response=super().to_representation(instance)
        response['created_by']=UserLoginSerializer(instance.created_by).data
        return response"""


class HomeQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeQuestion
        fields = '__all__'

      
        
class UserResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserResponse
        fields = '__all__'
  
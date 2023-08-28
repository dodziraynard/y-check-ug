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
    security_question_1 = serializers.PrimaryKeyRelatedField(queryset=SecurityQuestion.objects.all())
    security_answer_1 = serializers.CharField(max_length=200)
    security_question_2 = serializers.PrimaryKeyRelatedField(queryset=SecurityQuestion.objects.all())
    security_answer_2 = serializers.CharField(max_length=200)

    class Meta:
        model = User
        fields = ['username', 'password', 'security_question_1', 
                  'security_answer_1', 'security_question_2', 'security_answer_2']
        extra_kwargs = {'password': {'write_only': True}}


    def validate_username(self, value):
        if not value.startswith('YC'):
            raise serializers.ValidationError("Username must start with 'YC'")
        return value


    def create(self, validated_data):
        security_question_1 = validated_data.pop('security_question_1')
        security_answer_1 = validated_data.pop('security_answer_1')
        security_question_2 = validated_data.pop('security_question_2')
        security_answer_2 = validated_data.pop('security_answer_2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        SecurityQuestionAnswer.objects.create(
            user=user,
            security_question=security_question_1,
            answer=security_answer_1
        )
        SecurityQuestionAnswer.objects.create(
            user=user,
            security_question=security_question_2,
            answer=security_answer_2
        )

        return user






class UserOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'phone',
        'is_active', 'is_staff', 'is_superuser']





class SecurityQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityQuestion
        fields = ['id', 'question']



class SecurityQuestionAnswerSerializer(serializers.ModelSerializer):
    question = serializers.StringRelatedField(source='security_question.question')

    class Meta:
        model = SecurityQuestionAnswer
        fields = ['question']



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

    def to_representation(self, instance):
        response=super().to_representation(instance)
        response['created_by']=UserLoginSerializer(instance.created_by).data
        return response
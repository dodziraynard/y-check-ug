import hashlib
from rest_framework import serializers
from .models import User, SecurityQuestion, SecurityQuestionAnswer
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


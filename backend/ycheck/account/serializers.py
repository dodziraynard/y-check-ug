import hashlib
from rest_framework import serializers
from .models import User, SecurityQuestion, SecurityQuestionAnswer


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
        fields = ['username', 'password', 'first_name', 'last_name', 'phone', 'security_question_1', 
                  'security_answer_1', 'security_question_2', 'security_answer_2']
        extra_kwargs = {'password': {'write_only': True}, 
                        'security_question_1': {'write_only': True},
                        'security_answer_1': {'write_only': True},
                        'security_question_2': {'write_only': True},
                        'security_answer_2': {'write_only': True}}

    def create(self, validated_data):
        security_data = {}  
        for field in ['security_question_1', 'security_answer_1', 
        'security_question_2', 'security_answer_2']:
            if field in validated_data:
                security_data[field] = validated_data[field]  
                validated_data.pop(field, None)  

        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)

        if password is not None:
            instance.set_password(password)
        instance.save()

        SecurityQuestionAnswer.objects.create(
            user=instance,
            security_question=security_data['security_question_1'],
            answer=security_data['security_answer_1']
        )
        SecurityQuestionAnswer.objects.create(
            user=instance,
            security_question=security_data['security_question_2'],
            answer=security_data['security_answer_2']
        )

        return instance




class UserOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'phone',
        'is_active', 'is_staff', 'is_superuser']





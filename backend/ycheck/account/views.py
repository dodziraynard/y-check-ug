from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes
from .models import (User, PasswordResetToken, SecurityQuestion, SecurityQuestionAnswer)
from .serializers import (UserLoginSerializer, 
UserRegistrationSerializer, UserOutputSerializer, SecurityQuestionSerializer, UserProfileSerializer, SecurityQuestionAnswerSerializer)
from django.contrib.auth import authenticate
from rest_framework import status
from django.http import JsonResponse
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db import transaction





class ProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        if request.user.is_authenticated:
            serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)






class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        if user:
            serializer = UserLoginSerializer(user, many=False)
            token, created = Token.objects.get_or_create(user=user)
            data = serializer.data
            data['token'] = token.key
            return Response(data, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)





class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            output_serializer = UserOutputSerializer(user)
            data = output_serializer.data
            data['token'] = token.key
            return JsonResponse(data, status=201)
        return JsonResponse(serializer.errors, status=400)





class SecurityQuestionSetupView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        questions_and_answers = request.data.get('questions_and_answers', [])
      


        for qa in questions_and_answers:
            serializer = SecurityQuestionAnswerSerializer(data=qa)
            if serializer.is_valid():
                with transaction.atomic(): 
                    serializer.save(user=user)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Security questions set up successfully"}, status=status.HTTP_201_CREATED)







class GetSecurityQuestionView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            question = SecurityQuestion.objects.get(pk=pk)
        except SecurityQuestion.DoesNotExist:
            return Response({'error': 'Security question not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SecurityQuestionSerializer(question)
        return Response(serializer.data, status=status.HTTP_200_OK)



class GetAllSecurityQuestionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        questions = SecurityQuestion.objects.all()
        serializer = SecurityQuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)






class PasswordResetView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        username = request.data.get('username')
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        security_questions = SecurityQuestionAnswer.objects.filter(user=user)
        serializer = SecurityQuestionAnswerSerializer(security_questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)




class PasswordResetConfirmView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get('username')
        answer1 = request.data.get('answer1')
        answer2 = request.data.get('answer2')
        new_password = request.data.get('new_password')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        security_answers = SecurityQuestionAnswer.objects.filter(user=user)

        if security_answers.count() < 2:
            return Response({'error': 'Not enough security questions found'}, status=status.HTTP_400_BAD_REQUEST)

        if not check_password(answer1, security_answers[0].answer) or \
           not check_password(answer2, security_answers[1].answer):
            return Response({'error': 'Incorrect answers'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)




class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes
from .models import *
from .serializers import *
from django.contrib.auth import authenticate
from rest_framework import status
from django.http import JsonResponse
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.http import Http404




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



class GetAllSecurityQuestionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        security_questions = SecurityQuestion.objects.all()
        serializer = SecurityQuestionSerializer(security_questions, many=True)
        return Response(serializer.data)

        

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


class BasicSchoolView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        schools = BasicSchool.objects.all()
        serializer = BasicSchoolSerializer(schools, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = BasicSchoolSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BasicSchoolDeleteView(APIView):
    permission_classes = [AllowAny]
    def get_object(self, pk):
        try:
            return BasicSchool.objects.get(pk=pk)
        except BasicSchool.DoesNotExist:
            raise Http404
        
    def delete(self, request, pk, format=None):
        school = self.get_object(pk)
        school.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

 
    
class SNRSchoolView(APIView):
    permission_classes = [AllowAny]
        
    def get(self, request, format=None):
        schools = SNRSchool.objects.all()
        serializer = SNRSchoolSerializer(schools, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = SNRSchoolSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
   
    
class SNRSchoolDeleteView(APIView):
    permission_classes = [AllowAny]
    def get_object(self, pk):
        try:
            return SNRSchool.objects.get(pk=pk)
        except SNRSchool.DoesNotExist:
            raise Http404
        
    def delete(self, request, pk, format=None):
        school = self.get_object(pk)
        school.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommunityView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        communities = Community.objects.all()
        serializer = CommunitySerializer(communities, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CommunitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommunityDeleteView(APIView):
    permission_classes = [AllowAny]
    def get_object(self, pk):
        try:
            return Community.objects.get(pk=pk)
        except Community.DoesNotExist:
            raise Http404
        
    def delete(self, request, pk, format=None):
        community = self.get_object(pk)
        community.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

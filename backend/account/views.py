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
from django.db.models import Q
from django.http import QueryDict
from rest_framework.exceptions import ValidationError

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
        else:
            error_response = {
                "message": serializer.errors  
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)





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
            return Response({'message': 'Security question not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SecurityQuestionSerializer(question)
        return Response(serializer.data, status=status.HTTP_200_OK)



class GetAllSecurityQuestionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        questions = SecurityQuestion.objects.all()
        serializer = SecurityQuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        if serializer.errors:
             error_response = {
                "message": serializer.errors  
            }
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

           
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
        else:
            error_response = {
                "message": serializer.errors  
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

class BasicSchoolDeleteView(APIView):
    permission_classes = [AllowAny]
    def get_object(self, pk):
        try:
            return BasicSchool.objects.get(pk=pk)
        except BasicSchool.DoesNotExist:
            raise Http404
        
    def delete(self, request, pk, format=None):
        school = self.get_object(pk)
        deleted_data = {'message': 'Basic deleted successfully.'}
        school.delete()
        return Response(deleted_data,status=status.HTTP_204_NO_CONTENT)

 
    
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
        else:
            error_response = {
                "message": serializer.errors  
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)

    
   
    
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
        else:
            error_response = {
                "message": serializer.errors  
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)



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


    
class AddAdolescentView(APIView):
    permission_classes = [AllowAny]
        
    def get(self, request, format=None):
        adolescents = Adolescent.objects.all()
        serializer = AdolescentSerializer(adolescents, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        data = request.data
        serializer = AdolescentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            error_response = {
                "message": serializer.errors  
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

    
    
class AdolescentDeleteView(APIView):
    permission_classes = [AllowAny]
    def get_object(self, pk):
        try:
            return Adolescent.objects.get(pk=pk)
        except Adolescent.DoesNotExist:
            raise Http404
        
        
    def get(self, request, pk, format=None):
        adolescent = self.get_object(pk)
        serializer = AdolescentSerializer(adolescent)
        return Response(serializer.data)
        
    def delete(self, request, pk, format=None):
        adolescent = self.get_object(pk)
        adolescent.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class HomeQuestionView(APIView):
    permission_classes = [AllowAny]
        
    def get(self, request, format=None):
        questions = Question.objects.all()
        serializer = HomeQuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        data = request.data
        print(data)
        serializer = HomeQuestionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            error_response = {
                "message": serializer.errors  
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)


    
class SearchAdolescentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        data = request.data
        query = data['adolescent']
        adolescent = Adolescent.objects.filter(Q(pid=query) | Q(surname__icontains=query))
        
        if not adolescent.exists():
            return Response({"message": "No matching records found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = AdolescentSerializer(adolescent, many=True)
        return Response(serializer.data)

 
class save_responses(APIView):
    permission_classes = [AllowAny]
        
    def post(self, request, format=None):
        data = request.data
        print(data)
        serializer = UserResponseSerializer(data=data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            error_response = {
                "message": serializer.errors  
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)


class ResponsesView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        data = request.data
        adolescent_id = data['adolescent_id']
        responses = UserResponse.objects.filter(adolescent=adolescent_id)

        if not responses.exists():
            return Response({"message": "No matching records found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserResponseSerializer(responses, many=True)
        return Response(serializer.data)
 
class save_options(APIView):
    permission_classes = [AllowAny]
        
    def post(self, request, format=None):
        data = request.data
        print(data)
        serializer = OptionSerializer(data=data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            error_response = {
                "message": serializer.errors  
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)


class OptionsView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        data = request.data
        question_id = data['question_id']
        options = Option.objects.filter(question=question_id)

        if not options.exists():
            return Response({"message": "No matching records found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = OptionSerializer(options, many=True)
        return Response(serializer.data)
 
class getAllAdolescent(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        data = request.data
        adolescents = Adolescent.objects.all()
        serializer = AdolescentSerializer(adolescents,many=True)
        total_count = len(serializer.data) 
        return Response({"total_adolescent": total_count})
 
class getAllUsers(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        data = request.data
        users = User.objects.all()
        serializer = UserOutputSerializer(users,many=True)
        total_count = len(serializer.data) 
        return Response({"total_users": total_count})


class getAdolescentType(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        #PRIMARY
        primary = Adolescent.objects.filter(adolescent_type="PR")
        primary_serializer = AdolescentSerializer(primary,many=True)
        primary_count = len(primary_serializer.data) 
        # SECONDARY
        secondary = Adolescent.objects.filter(adolescent_type="SC")
        secondary_serializer = AdolescentSerializer(secondary,many=True)
        secondary_count = len(secondary_serializer.data) 
        # COMMUNITY
        community = Adolescent.objects.filter(adolescent_type="CM")
        community_serializer = AdolescentSerializer(community,many=True)
        community_count = len(community_serializer.data) 
        return Response({
            "primary": primary_count,
            "secondary":secondary_count,
            "community":community_count
        })
        

class UserView(APIView):
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.all()
        serializer = UserOutputSerializer(users,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserDeleteView(APIView):
    permission_classes = [AllowAny]
    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404
        
        
    def get(self, request, pk, format=None):
        user = self.get_object(pk)
        serializer = UserOutputSerializer(user)
        return Response(serializer.data)
        
    def delete(self, request, pk, format=None):
        user = self.get_object(pk)
        user.delete()
        return Response({"message":"User Deleted successfully"},status=status.HTTP_204_NO_CONTENT)
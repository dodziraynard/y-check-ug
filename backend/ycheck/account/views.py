from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import User
from .serializers import UserLoginSerializer, UserRegistrationSerializer, UserOutputSerializer
from django.contrib.auth import authenticate
from rest_framework import status
from django.http import JsonResponse

import logging

logger = logging.getLogger(__name__)



@api_view(['POST'])
def loginView(request):
    if request.method == 'POST':
        username = request.data['username']
        password = request.data['password']

        if password and username:
            user = authenticate(request, username=username, password=password)

            if user is not None:
                serializer = UserLoginSerializer(user, many=False)
                token, created = Token.objects.get_or_create(user=user)
                data = serializer.data
                data['token'] = token.key
                return Response(data, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)




@api_view(['POST'])
def userRegistration(request):
    if request.method == 'POST':
        serializer = UserRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            output_serializer = UserOutputSerializer(user)
            data = output_serializer.data
            data['token'] = token.key
            logger.debug(f"Response data: {data}")
            return JsonResponse(data, status=201)

        logger.debug(f"Serializer errors: {serializer.errors}")
        return JsonResponse(serializer.errors, status=400)




from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.views import View










# Create your views here.

class LoginView(View):

    template_name = ''

    def get(self, request):
        return render(request, self.template_name)

    
    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        next_ = request.GET.get('next')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect(next_ or '')
        else:
            message = 'Invalid credentials. Please try again'
            messages.error(request, message)
            
            #not populating the password field for security reasons
            context = {k: v for k, v in request.POST.items() if k != 'password'}  
            return render(request, self.template_name, context)




class LogoutView(View):

    
    def get(self, request):
        logout(request)
        return redirect('')
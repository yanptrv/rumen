from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status


# Create your views here.

def hello(request):
    return HttpResponse('<h2>Hello there</h2>')

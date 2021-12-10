"""Prajna URL List"""
from django.urls import path
from .views import hello_world

urlpatterns = [
    path('api/helloworld', hello_world)
]

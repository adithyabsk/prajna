"""Prajna URL List"""
from django.urls import path
from .views import landing_page

urlpatterns = [
    # path('api/helloworld', hello_world)
    path("", landing_page)
]

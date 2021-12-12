"""Prajna URL List"""
from django.urls import path
from .views import landing_page, create_puzzle

urlpatterns = [
    path("", landing_page, name="landing-page"),
    path("create-puzzle", create_puzzle, name="create-puzzle"),
]

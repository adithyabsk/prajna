from django.shortcuts import render
# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
#
# # Create your views here.
# @api_view(['GET'])
# def hello_world(request):
#     """Test view."""
# #     if request.method == 'GET':
#     return Response("Hello World!")


def landing_page(request):
    return render(request, "prajna/landing.html")

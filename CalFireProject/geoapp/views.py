from django.shortcuts import render
from rest_framework import viewsets
from .models import FirePerimeter, PostfireDamage
from geoapp.serializers import FirePerimeterSerializer, PostfireDamageSerializer

class FirePerimeterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FirePerimeter.objects.all()
    serializer_class = FirePerimeterSerializer

class PostfireDamageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PostfireDamage.objects.all()
    serializer_class = PostfireDamageSerializer

def map_view(request):
    return render(request, "geoapp/map.html")

def authors_view(request):
    return render(request, "geoapp/authors.html")

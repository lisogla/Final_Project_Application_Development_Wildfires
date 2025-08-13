# geoapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FirePerimeterViewSet, PostfireDamageViewSet, map_view, authors_view

router = DefaultRouter()
router.register(r'wildfires', FirePerimeterViewSet)
router.register(r'postfiredamage', PostfireDamageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('map/', map_view, name='map'),
    path('authors/', authors_view, name='authors')
]

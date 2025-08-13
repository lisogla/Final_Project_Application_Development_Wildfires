from rest_framework_gis.serializers import GeoFeatureModelSerializer
from geoapp.models import FirePerimeter, PostfireDamage

class FirePerimeterSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = FirePerimeter
        geo_field = "geom"  
        fields = "__all__"

class PostfireDamageSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = PostfireDamage
        geo_field = "geom"  
        fields = '__all__'

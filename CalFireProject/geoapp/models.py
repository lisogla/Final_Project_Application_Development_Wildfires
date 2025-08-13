from django.contrib.gis.db import models

class FirePerimeter(models.Model):
    year = models.IntegerField()
    state = models.CharField(max_length=2)
    agency = models.CharField(max_length=3)
    unit_id = models.CharField(max_length=3)
    fire_name = models.CharField(max_length=34)
    inc_num = models.CharField(max_length=8)
    alarm_date = models.DateField()
    cont_date = models.DateField()
    cause = models.IntegerField()
    c_method = models.IntegerField()
    objective = models.IntegerField()
    gis_acres = models.FloatField()
    comments = models.CharField(max_length=255, null=True, blank=True)
    shape_leng = models.FloatField()
    shape_area = models.FloatField()

    # Geometry field (Shapefile uses Polygon geometry)
    geom = models.MultiPolygonField(srid=3857)  # SRID from ogrinfo output

    def __str__(self):
        return self.fire_name

class PostfireDamage(models.Model):
    damage = models.CharField(max_length=100)
    streetnumb = models.IntegerField(null=True, blank=True)
    streetname = models.CharField(max_length=100, null=True, blank=True)
    streettype = models.CharField(max_length=50, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=2, null=True, blank=True)
    zipcode = models.IntegerField(null=True, blank=True)
    calfireuni = models.CharField(max_length=50, null=True, blank=True)
    county = models.CharField(max_length=100, null=True, blank=True)
    incidentna = models.CharField(max_length=100, null=True, blank=True)
    incidentnu = models.CharField(max_length=100, null=True, blank=True)
    incidentst = models.DateField(null=True, blank=True)
    hazardtype = models.CharField(max_length=50, null=True, blank=True)
    defensivea = models.CharField(max_length=100, null=True, blank=True)
    structuret = models.CharField(max_length=100, null=True, blank=True)
    structurec = models.CharField(max_length=100, null=True, blank=True)
    exteriorsi = models.CharField(max_length=100, null=True, blank=True)
    yearbuilt = models.IntegerField(null=True, blank=True)
    siteaddres = models.CharField(max_length=200, null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    geom = models.PointField(srid=3857) 

    def __str__(self):
        return f"{self.damage} at {self.siteaddres or 'unknown address'}"

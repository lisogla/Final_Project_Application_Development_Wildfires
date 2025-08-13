from pathlib import Path
from django.contrib.gis.utils import LayerMapping
from geoapp.models import PostfireDamage

postfire_mapping = {
    'damage': 'DAMAGE',
    'streetnumb': 'STREETNUMB',
    'streetname': 'STREETNAME',
    'streettype': 'STREETTYPE',
    'city': 'CITY',
    'state': 'STATE',
    'zipcode': 'ZIPCODE',
    'calfireuni': 'CALFIREUNI',
    'county': 'COUNTY',
    'incidentna': 'INCIDENTNA',
    'incidentnu': 'INCIDENTNU',
    'incidentst': 'INCIDENTST',
    'hazardtype': 'HAZARDTYPE',
    'defensivea': 'DEFENSIVEA',
    'structuret': 'STRUCTURET',
    'structurec': 'STRUCTUREC',
    'exteriorsi': 'EXTERIORSI',
    'yearbuilt': 'YEARBUILT',
    'siteaddres': 'SITEADDRES',
    'latitude': 'Latitude',
    'longitude': 'Longitude',
    'geom': 'POINT',  
}

postfireDamage_shp = Path(__file__).resolve().parent / "data" / "POSTFIRE_2024.shp" 

def run(verbose=True):
    lm = LayerMapping(PostfireDamage, postfireDamage_shp, postfire_mapping, transform=True)
    lm.save(strict=True, verbose=verbose)

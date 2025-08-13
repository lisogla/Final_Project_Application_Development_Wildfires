from pathlib import Path
from django.contrib.gis.utils import LayerMapping
from .models import FirePerimeter

fireperimeter_mapping = {
    'year': 'YEAR_',
    'state': 'STATE',
    'agency': 'AGENCY',
    'unit_id': 'UNIT_ID',
    'fire_name': 'FIRE_NAME',
    'inc_num': 'INC_NUM',
    'alarm_date': 'ALARM_DATE',
    'cont_date': 'CONT_DATE',
    'cause': 'CAUSE',
    'c_method': 'C_METHOD',
    'objective': 'OBJECTIVE',
    'gis_acres': 'GIS_ACRES',
    'comments': 'COMMENTS',
    'shape_leng': 'Shape_Leng',
    'shape_area': 'Shape_Area',
    'geom': 'MULTIPOLYGON',
}

firePerimeters_shp = Path(__file__).resolve().parent / "data" / "California_Fire_Perimeters_2024.shp" 


def run(verbose=True):
    lm = LayerMapping(FirePerimeter, firePerimeters_shp, fireperimeter_mapping, transform=False)
    lm.save(strict=True, verbose=verbose)

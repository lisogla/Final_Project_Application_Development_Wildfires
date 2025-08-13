from django.core.management.base import BaseCommand
from django.contrib.gis.utils import LayerMapping
from geoapp.models import Wildfire  # adjust to your app name

fireperimeter_mapping = {
    'objectid': 'OBJECTID',
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
    'shape_length': 'Shape_Length',
    'shape_area': 'Shape_Area',
    'perimeter': 'MULTIPOLYGON',
}

class Command(BaseCommand):
    help = "Import fire perimeter GeoJSON data"

    def add_arguments(self, parser):
        parser.add_argument('geojson_path', type=str, help='Path to the GeoJSON file')

    def handle(self, *args, **options):
        geojson_path = options['geojson_path']
        lm = LayerMapping(Wildfire, geojson_path, fireperimeter_mapping, transform=False)
        lm.save(strict=True, verbose=True)
        self.stdout.write(self.style.SUCCESS('Successfully imported fire perimeters'))

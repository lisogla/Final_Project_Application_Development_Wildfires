#from django.contrib.gis import admin
#from .models import FirePerimeter

#admin.site.register(FirePerimeter, admin.GISModelAdmin)

# geoapp/admin.py
#from django.contrib import admin
#from .models import FirePerimeter

#admin.site.register(FirePerimeter, admin.ModelAdmin)

# geoapp/admin.py
from django.contrib import admin
from .models import FirePerimeter

admin.site.register(FirePerimeter, admin.ModelAdmin)






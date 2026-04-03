from django.contrib import admin
from .models import CustomUser, ProviderProfile

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(ProviderProfile)



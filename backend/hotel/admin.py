from django.contrib import admin
from .models import Guest
from .models import Room
from .models import Reservation
from .models import AdditionalService
from .models import Invoice

admin.site.register(Guest)
admin.site.register(Room)
admin.site.register(Reservation)
admin.site.register(AdditionalService)
admin.site.register(Invoice)


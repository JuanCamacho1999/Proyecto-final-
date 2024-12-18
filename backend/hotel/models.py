from django.db import models


from django.db import models

class Room(models.Model):
    ROOM_TYPES = [
        ('single', 'Single'),
        ('double', 'Double'),
        ('suite', 'Suite'),
        ('matrimonial', 'Matrimonial'),
        ('presidential', 'Presidential'),
    ]
    number = models.CharField(max_length=10, unique=True)
    type = models.CharField(max_length=20, choices=ROOM_TYPES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.BooleanField(default=True)

    def __str__(self):
        return f"Room {self.number} ({self.type})"

class AdditionalService(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.name

class Guest(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name

class Reservation(models.Model):
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    check_in = models.DateField()
    check_out = models.DateField()
    services = models.ManyToManyField(AdditionalService, blank=True)

    def __str__(self):
        return f"Reservation for {self.guest.name} in Room {self.room.number}"

class Invoice(models.Model):
    reservation = models.OneToOneField(Reservation, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=50)

    def calculate_total(self):
        total = self.reservation.room.price
        for service in self.reservation.services.all():
            total += service.price
        total -= self.discount
        self.total = total
        self.save()

    def __str__(self):
        return f"Invoice for {self.reservation.guest.name}"


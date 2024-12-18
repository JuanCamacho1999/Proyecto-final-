from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoomViewSet, AdditionalServiceViewSet, GuestViewSet, ReservationViewSet, InvoiceViewSet, LoginView, RegisterView

router = DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'services', AdditionalServiceViewSet)
router.register(r'guests', GuestViewSet)
router.register(r'reservations', ReservationViewSet)
router.register(r'invoices', InvoiceViewSet)
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('', include(router.urls)),
]

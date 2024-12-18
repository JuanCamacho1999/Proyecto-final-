from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from .models import Room, AdditionalService, Guest, Reservation, Invoice
from .serializers import RoomSerializer, AdditionalServiceSerializer, GuestSerializer, ReservationSerializer, InvoiceSerializer, LoginSerializer, UserSerializer

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        room_type = request.query_params.get('type')
        available = request.query_params.get('available')
        queryset = self.queryset

        if room_type:
            queryset = queryset.filter(type=room_type)
        if available is not None:
            queryset = queryset.filter(available=(available.lower() == 'true'))

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class AdditionalServiceViewSet(viewsets.ModelViewSet):
    queryset = AdditionalService.objects.all()
    serializer_class = AdditionalServiceSerializer

class GuestViewSet(viewsets.ModelViewSet):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def create(self, request, *args, **kwargs):
        guest_name = request.data.get('guest_name')
        try:
            guest = Guest.objects.get(name=guest_name)  
            reservation_data = {
                'guest': guest.id,  
                'room': request.data.get('room'),
                'check_in': request.data.get('check_in'),
                'check_out': request.data.get('check_out'),
                'services': request.data.get('services', []),
            }
            serializer = self.get_serializer(data=reservation_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Guest.DoesNotExist:
            return Response({'error': 'Huésped no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['get'])
    def available_reservations(self, request):
        reservations = Reservation.objects.all()
        data = [
            {
                "id": reservation.id,
                "guest_name": reservation.guest.name,
                "room_number": reservation.room.number,
                "check_in": reservation.check_in,
                "check_out": reservation.check_out,
            }
            for reservation in reservations
        ]
        return Response(data)

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    @action(detail=False, methods=['post'])
    def add_invoice_to_reservation(self, request):
        reservation_id = request.data.get('reservation')
        total = request.data.get('total')
        discount = request.data.get('discount', 0)
        payment_method = request.data.get('payment_method')

        try:
            
            reservation = Reservation.objects.get(id=reservation_id)

            
            if hasattr(reservation, 'invoice'):
                return Response(
                    {"error": "Esta reservación ya tiene una factura asociada."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            
            invoice = Invoice.objects.create(
                reservation=reservation,
                total=total,
                discount=discount,
                payment_method=payment_method
            )
            serializer = self.get_serializer(invoice)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Reservation.DoesNotExist:
            return Response({"error": "Reservación no encontrada."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            invoice.discount = discount
            invoice.total -= discount
            invoice.save()

            return Response({
                "message": "Descuento aplicado",
                "new_total": invoice.total
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
   




from django.contrib.auth.models import User, Group
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

# views.py
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, LoginSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

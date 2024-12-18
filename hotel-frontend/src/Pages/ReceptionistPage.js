import React, { useState, useEffect } from 'react';
import { getRooms, getServices, createReservation, searchGuestByName } from '../services/api';
import { Container, TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, CircularProgress, Alert } from '@mui/material';
import imagenProfile from "../assets/sala.jpg";

const ReceptionistPage = () => {
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [reservation, setReservation] = useState({
    guest_name: '', // Nombre del huésped
    guest_id: '', // ID del huésped (esto es lo que deberías enviar al backend)
    room: '',
    check_in: '',
    check_out: '',
    services: [],
  });
  const [loading, setLoading] = useState(true);  // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores

  useEffect(() => {
    const fetchRoomsAndServices = async () => {
      try {
        setLoading(true);
        const roomData = await getRooms();
        const serviceData = await getServices();

        if (Array.isArray(roomData) && Array.isArray(serviceData)) {
          setRooms(roomData);
          setServices(serviceData);
        } else {
          throw new Error('Datos no válidos recibidos');
        }
      } catch (err) {
        setError('Hubo un problema al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomsAndServices();
  }, []);

  // Nueva implementación de handleGuestNameChange
  const handleGuestNameChange = async (e) => {
    const guestName = e.target.value;
    setReservation((prev) => ({ ...prev, guest_name: guestName }));  // Usar función de actualización
  
    try {
      if (guestName.trim() !== '') {
        const guest = await searchGuestByName(guestName);
        if (guest) {
          setReservation((prev) => ({ ...prev, guest_id: guest.id }));  // Asegurarte de actualizar correctamente el guest_id
        } else {
          setReservation((prev) => ({ ...prev, guest_id: '' }));
          alert('Huésped no encontrado');
        }
      } else {
        setReservation((prev) => ({ ...prev, guest_id: '' }));
      }
    } catch (err) {
      console.error('Error al buscar huésped:', err);
    }
  };
  

  const handleSubmitReservation = async () => {
    // Enviar el ID del huésped en lugar del nombre
    try {
      await createReservation(reservation);
      alert('Reserva creada');
    } catch (err) {
      console.error(err);
      alert('Hubo un problema al crear la reserva');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="col-md-6" style={{ padding: '20px' }}>
        <Typography variant="h4" className='titulo'>Registrar Reservación</Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Nombre del Huésped"
          InputLabelProps={{
            style: { color: 'white' } // Estilo del label
          }} 
          value={reservation.guest_name}
          onChange={handleGuestNameChange} // Llamar a la función para actualizar el nombre y buscar al huésped
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel style={{color: 'white'}}>Habitación</InputLabel>
          <Select
            value={reservation.room}
            onChange={(e) => setReservation({ ...reservation, room: e.target.value })}
          >
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>{room.number} - {room.type}</MenuItem>
              ))
            ) : (
              <MenuItem disabled>No hay habitaciones disponibles</MenuItem>
            )}
          </Select>
        </FormControl>

        <TextField
          label="Fecha de Check-In"
          InputLabelProps={{
            style: { color: 'white' } // Estilo del label
          }} 
          type="date"
          value={reservation.check_in}
          onChange={(e) => setReservation({ ...reservation, check_in: e.target.value })}
          fullWidth
        />
        <TextField
          label="Fecha de Check-Out"
          InputLabelProps={{
            style: { color: 'white' } // Estilo del label
          }} 
          type="date"
          value={reservation.check_out}
          onChange={(e) => setReservation({ ...reservation, check_out: e.target.value })}
          fullWidth
        />

        <Button onClick={handleSubmitReservation} variant="contained">Registrar Reservación</Button>
      </div>
      <div className="col-md-6" style={{ padding: '0px' }}>
        <img src={imagenProfile }  className='.estilo-profile' alt='' style={{'borderRadius':'150px', 'height': '750px','width': '900px'}} />          
      </div>
    </div>
  );
};

export default ReceptionistPage;

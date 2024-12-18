import React, { useState, useEffect } from 'react';
import { getRooms, createReservation } from '../services/api';
import { Container, Button, Typography, List, ListItem, ListItemText, CircularProgress, Alert, TextField } from '@mui/material';

const CustomerPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const roomData = await getRooms();

    
        console.log('Rooms data fetched:', roomData); 

        if (Array.isArray(roomData)) {
          setRooms(roomData);
          setFilteredRooms(roomData);
        } else {
          throw new Error('Datos de habitaciones no válidos');
        }
      } catch (err) {
        setError('Hubo un problema al cargar las habitaciones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const filtered = rooms.filter(room =>
      room.number.toLowerCase().includes(event.target.value.toLowerCase()) ||
      room.type.toLowerCase().includes(event.target.value.toLowerCase()) ||
      room.price.toString().includes(event.target.value)
    );
    setFilteredRooms(filtered);
  };

  const handleReservation = async (roomId) => {
    try {
      await createReservation({ roomId });
      alert('Reservación solicitada con éxito');
    } catch (err) {
      console.error('Error al realizar la reservación:', err);
      alert('Hubo un error al realizar la reservación');
    }
  };

  return (
    <Container>
      <div className='fullscreen-bg2'></div>
      <Typography variant="h4" gutterBottom className='titulo2'>Ver Habitaciones</Typography>

      {loading && <CircularProgress />}

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Buscar habitación"
        InputLabelProps={{
          style: { color: 'white' } // Estilo del label
        }} 
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        margin="normal"
      />

      <List>
        
        {(searchQuery ? filteredRooms : rooms).map((room) => (
          <ListItem key={room.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <ListItemText
              primary={`Habitación ${room.number}`}
              secondary={`Tipo: ${room.type}, Precio: $${room.price}`}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleReservation(room.id)}
              style={{ marginLeft: '10px' }}
            >
              Solicitar Reservación
            </Button>
          </ListItem>
        ))}
      </List>

    
      {searchQuery && filteredRooms.length === 0 && (
        <Typography variant="body1" color="textSecondary"
        style= {{ 'color': 'white' }}>
          No se encontraron habitaciones que coincidan con la búsqueda.
        </Typography>
      )}
     
      {rooms.length === 0 && (
        <Typography variant="body1" color="textSecondary"
        style= {{ 'color': 'white' }} // Estilo del label
         >
          
          No hay habitaciones disponibles en este momento.
        </Typography>
      )}
    </Container>
  );
};

export default CustomerPage;

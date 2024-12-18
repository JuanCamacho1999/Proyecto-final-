import React, { useState } from 'react';
import { getRooms, createRoom, deleteRoom, searchRooms } from '../services/api';
import { Container, Button, TextField, Typography, List, ListItem, ListItemText } from '@mui/material';
import imagen from '../assets/admin.jpg';
import '../App.css';

const AdminPage = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ number: '', type: '', price: '', available: true });
  const [searchFilters, setSearchFilters] = useState({ type: '', price: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showList, setShowList] = useState(false);

  const handleCreateRoom = async () => {
    try {
      await createRoom(newRoom);
      setNewRoom({ number: '', type: '', price: '', available: true });
      setError(null);
    } catch (err) {
      console.error('Error al crear habitación:', err);
      setError('Hubo un problema al crear la habitación');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await deleteRoom(roomId);
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
      if (rooms.length === 1) {
        handleSearch();
      }
    } catch (err) {
      console.error('Error al eliminar habitación:', err);
      setError('Hubo un problema al eliminar la habitación');
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { type, price } = searchFilters;

      
      const filteredRooms = await searchRooms({
        type: type,
        available: true,  
      });

      
      const filteredByPrice = filteredRooms.filter(room => {
        return room.price.toString().includes(price);
      });

      if (Array.isArray(filteredByPrice)) {
        setRooms(filteredByPrice);
        setShowList(true);
      } else {
        throw new Error('Datos de habitaciones inválidos');
      }
    } catch (err) {
      setError('Error al buscar habitaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchFilters({ type: '', price: '' });
    setRooms([]);
    setShowList(false);
  };

  return (
    <Container
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: '100vh',
        overflowY: 'auto',
        flexDirection: 'row',
      }}
    >
      <div className="card card-body shadow-lg" style={{ width: '100%', maxWidth: '800px' }}>
        <Typography
          variant="h4"
          className="titulo"
          style={{ color: '#ffe4c4', textAlign: 'center', marginBottom: '20px' }}
        >
          Gestión de Habitaciones
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        {/* Buscar habitaciones */}
        <Typography
          variant="h6"
          className="titulo"
          style={{ color: '#ffe4c4', marginBottom: '20px' }}
        >
          Buscar Habitaciones
        </Typography>
        <div style={{ marginBottom: '20px' }}>
          <TextField
            label="Tipo"
            value={searchFilters.type}
            onChange={(e) => setSearchFilters({ ...searchFilters, type: e.target.value })}
            style={{ marginRight: '10px', color: '#ffe4c4' }}
            InputLabelProps={{ style: { color: '#ffe4c4' } }}
            InputProps={{ style: { color: '#ffe4c4' } }}
          />
          <TextField
            label="Precio"
            value={searchFilters.price}
            onChange={(e) => setSearchFilters({ ...searchFilters, price: e.target.value })}
            style={{ marginRight: '10px' }}
            InputLabelProps={{ style: { color: '#ffe4c4' } }}
            InputProps={{ style: { color: '#ffe4c4' } }}
          />
          <Button onClick={handleSearch} variant="contained" style={{ color: '#ffe4c4', backgroundColor: '#202020' }}>
            Buscar
          </Button>
          <Button onClick={handleClearSearch} variant="outlined" style={{ marginLeft: '10px', color: '#ffe4c4' }}>
            Limpiar
          </Button>
        </div>

        {loading ? (
          <Typography style={{ color: '#ffe4c4' }}>Cargando...</Typography>
        ) : (
          showList && (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {rooms.length > 0 ? (
                <List>
                  {rooms.map((room) => (
                    <ListItem key={room.id}>
                      <ListItemText
                        primary={`Habitación ${room.number}`}
                        secondary={`Tipo: ${room.type}, Precio: $${room.price}, Disponible: ${room.available ? 'Sí' : 'No'}`}
                        primaryTypographyProps={{ style: { color: '#ffe4c4' } }}
                        secondaryTypographyProps={{ style: { color: '#ffe4c4' } }}
                      />
                      <Button
                        onClick={() => handleDeleteRoom(room.id)}
                        variant="contained"
                        color="error"
                        style={{ marginLeft: '10px' }}
                      >
                        Eliminar
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography style={{ color: '#ffe4c4' }}>No se encontraron habitaciones</Typography>
              )}
            </div>
          )
        )}

        {/* Crear habitación */}
        <Typography
          variant="h6"
          className="titulo"
          style={{ color: '#ffe4c4', marginTop: '20px' }}
        >
          Crear Nueva Habitación
        </Typography>
        <TextField
          label="Número"
          value={newRoom.number}
          onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
          InputLabelProps={{ style: { color: '#ffe4c4' } }}
          InputProps={{ style: { color: '#ffe4c4' } }}
        />
        <TextField
          label="Tipo"
          value={newRoom.type}
          onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
          InputLabelProps={{ style: { color: '#ffe4c4' } }}
          InputProps={{ style: { color: '#ffe4c4' } }}
        />
        <TextField
          label="Precio"
          value={newRoom.price}
          onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
          InputLabelProps={{ style: { color: '#ffe4c4' } }}
          InputProps={{ style: { color: '#ffe4c4' } }}
        />
        <Button
          onClick={handleCreateRoom}
          variant="contained"
          style={{ color: '#ffe4c4', backgroundColor: '#202020', borderColor: 'slategray' }}
        >
          Crear Habitación
        </Button>
        <div style={{ height: '40px' }} />
      </div>

      {/* Imagen al costado */}
      <div className="col-md-6" style={{ padding: '100px', flex: 1 }}>
        <img
          src={imagen}
          className="estilo-profile"
          alt=""
          style={{ borderRadius: '60px', height: '400px', width: '500px' }}
        />
      </div>
    </Container>
  );
};

export default AdminPage;

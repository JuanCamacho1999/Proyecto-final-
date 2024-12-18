import React, { useState, useEffect } from 'react';
import { getAvailableReservations, addInvoiceToReservation } from '../services/api';
import { Container, TextField, Button, Typography, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import imagen from '../assets/admin.jpg'; // Add your image path here
import '../App.css'; // Ensure you have a global CSS for consistent styling

const AddInvoicePage = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState('');
  const [total, setTotal] = useState('');
  const [discount, setDiscount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getAvailableReservations();
        setReservations(data);
      } catch (err) {
        setError('Error al cargar las reservaciones');
      }
    };
    fetchReservations();
  }, []);

  const handleAddInvoice = async () => {
    try {
      setError('');
      setSuccess('');
      await addInvoiceToReservation({
        reservation: selectedReservation,
        total: total,
        discount: discount,
        payment_method: paymentMethod,
      });
      setSuccess('Factura creada exitosamente.');
    } catch (err) {
      setError('Hubo un problema al crear la factura.');
    }
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
      {/* Main content with card-style layout */}
      <div className="card card-body shadow-lg" style={{ width: '100%', maxWidth: '800px' }}>
        <Typography
          variant="h4"
          className="titulo"
          style={{ color: '#ffe4c4', textAlign: 'center', marginBottom: '20px' }}
        >
          Agregar Factura a una Reservación
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <FormControl fullWidth margin="normal">
          <InputLabel style={{ color: '#ffe4c4' }}>Seleccionar Reservación</InputLabel>
          <Select
            value={selectedReservation}
            onChange={(e) => setSelectedReservation(e.target.value)}
            style={{ color: '#ffe4c4' }}
            MenuProps={{ PaperProps: { style: { backgroundColor: '#202020', color: '#ffe4c4' } } }}
          >
            {reservations.map((res) => (
              <MenuItem key={res.id} value={res.id}>
                {`Habitación ${res.room_number} - ${res.guest_name} (${res.check_in} a ${res.check_out})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Total"
          InputLabelProps={{ style: { color: '#ffe4c4' } }}
          InputProps={{ style: { color: '#ffe4c4' } }}
          type="number"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Descuento"
          InputLabelProps={{ style: { color: '#ffe4c4' } }}
          InputProps={{ style: { color: '#ffe4c4' } }}
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Método de Pago"
          InputLabelProps={{ style: { color: '#ffe4c4' } }}
          InputProps={{ style: { color: '#ffe4c4' } }}
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          fullWidth
          margin="normal"
        />

        <Button
          onClick={handleAddInvoice}
          variant="contained"
          style={{
            color: '#ffe4c4',
            backgroundColor: '#202020',
            borderColor: 'slategray',
            marginTop: '20px',
          }}
        >
          Agregar Factura
        </Button>
      </div>

      {/* Background image on the side */}
      <div
        style={{
          backgroundImage: `url(${imagen})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '50%',
          borderRadius: '0 60px 60px 0',
        }}
      />
    </Container>
  );
};

export default AddInvoicePage;

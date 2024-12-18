import axios from 'axios';
import { saveTokens } from './storage';

const API_URL = 'http://127.0.0.1:8000/api/';
const New_URL = 'http://127.0.0.1:8000/Login/';

const api = axios.create({
  baseURL: API_URL, New_URL
});


export const getRooms = async () => {
  try {
    const response = await api.get('rooms/');
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
  }
};


export const createRoom = async (roomData) => {
  try {
    const response = await api.post('rooms/', roomData);
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
  }
};


export const searchRooms = async (filters) => {
  const { type, available, price } = filters;
  try {
    const response = await api.get('rooms/search/', {
      params: { type, available, price },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching rooms:", error);
  }
};


export const getServices = async () => {
  try {
    const response = await api.get('services/');
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
  }
};


export const createReservation = async (reservationData) => {
    try {
      
      const { guest_name, room, check_in, check_out, services } = reservationData;
      
      const reservationPayload = {
        guest: guest_name,  
        room,
        check_in,
        check_out,
        services: services.map(service => service.id), 
      };
  
      const response = await api.post('reservations/', reservationPayload);
      return response.data;
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error; 
    }
  };
  

export const getReservations = async () => {
  try {
    const response = await api.get('reservations/');
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }
};

export const searchGuestByName = async (name) => {
    try {
      const response = await api.get(`guests/?name=${name}`);
      return response.data.length > 0 ? response.data[0] : null; 
    } catch (error) {
      console.error('Error al buscar huésped:', error);
      throw new Error('No se pudo buscar el huésped');
    }
};



export const applyDiscount = async (invoiceId, discount) => {
  try {
    const response = await api.post(`invoices/${invoiceId}/apply_discount/`, { discount });
    return response.data;
  } catch (error) {
    console.error("Error al aplicar el descuento:", error);
    throw error;
  }
};

export const addInvoiceToReservation = async (invoiceData) => {
  try {
    const response = await api.post('invoices/add_invoice_to_reservation/', invoiceData);
    return response.data; 
  } catch (error) {
    console.error("Error al agregar la factura:", error);
    throw error;
  }
};

export const getAvailableReservations = async () => {
    try {
      const response = await api.get('reservations/available_reservations/');
      return response.data;
    } catch (error) {
      console.error("Error al obtener reservaciones:", error);
      throw error;
    }
  };

// services.js


export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post('register/', {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
  }
};


export const loginUser = async (username, password) => {
  try {
    const response = await api.post('login/', {
      username,
      password,
    });

    const { access, refresh, role } = response.data; // Obtener el rol
    saveTokens({ access, refresh });                // Guardar tokens
    localStorage.setItem('role', role);             // Guardar rol en localStorage
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};


  export const updateRoom = async (roomId, roomData) => {
    try {
      const response = await api.put(`rooms/${roomId}/`, roomData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar habitación:", error);
      throw error;
    }
  };
  
  export const deleteRoom = async (roomId) => {
    try {
      await api.delete(`rooms/${roomId}/`);
    } catch (error) {
      console.error("Error al eliminar habitación:", error);
      throw error;
    }
  };



export default api;

// src/services/storage.js

export const saveTokens = (tokens) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  };
  
  export const getAccessToken = () => {
    return localStorage.getItem('access_token');
  };
  
  export const removeTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };
  
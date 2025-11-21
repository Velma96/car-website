// src/api/api.js
const API_BASE = 
  process.env.NODE_ENV === 'production' 
    ? 'https://velma-backend.onrender.com'   // LIVE
    : 'http://127.0.0.1:5000';               // LOCAL

export default API_BASE;
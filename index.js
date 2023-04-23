import dotenv from 'dotenv';
dotenv.config();

import api from './api/index.js';

// For testing purposes
export default api.launch(process.env.API_PORT);

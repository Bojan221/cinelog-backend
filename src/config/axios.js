const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3', 
  timeout: 10000,                        
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
    'X-Custom-Header': 'NodeJsClient'
  }
});

module.exports = apiClient;
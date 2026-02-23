// Configuration for connecting to the server
// IMPORTANT: Update SERVER_IP with the actual IP address of the SERVER laptop

// For same laptop (localhost):
// export const SERVER_IP = 'localhost';

// For different laptops on same network:
// Replace with the SERVER laptop's IP address (shown when server starts)
export const SERVER_IP = 'localhost'; // CHANGE THIS to server IP (e.g., '192.168.1.100')

export const SERVER_PORT = '8888';
export const SERVER_URL = `http://${SERVER_IP}:${SERVER_PORT}`;

console.log('🔗 Connecting to server:', SERVER_URL);

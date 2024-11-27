// testSetup.js
const db = require('../config/database');

// Cerrar la conexión después de todas las pruebas
after(async () => {
  await db.end();
});

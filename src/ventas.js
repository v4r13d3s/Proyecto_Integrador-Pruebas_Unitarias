const express = require('express');
const cors = require('cors');
const ventasController = require('../controllers/ventasController');

const app = express(); // Crear la aplicación de Express

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Rutas para ventas
app.get('/api/ventas', ventasController.getAll); // Obtener todas las ventas
app.get('/api/ventas/:folio', ventasController.getById); // Obtener venta por folio
app.post('/api/ventas', ventasController.create); // Crear una nueva venta
app.put('/api/ventas/:folio', ventasController.update); // Actualizar una venta por folio
app.delete('/api/ventas/:folio', ventasController.delete); // Eliminar una venta por folio

// Manejo de errores 404 para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

// Middleware de manejo de errores genéricos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal.', error: err.message });
});

// Exportar la aplicación para que pueda ser utilizada en las pruebas y el servidor
module.exports = app;

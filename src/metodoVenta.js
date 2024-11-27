const express = require('express');
const cors = require('cors');
const metodoVentaController = require('../controllers/metodoVentaController.js');

const app = express(); // Crear la aplicación de Express

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Rutas para Métodos de Venta
app.get('/api/metodos-venta', metodoVentaController.getAll); // Obtener todos los métodos de venta
app.get('/api/metodos-venta/:id', metodoVentaController.getById); // Obtener un método de venta por ID
app.post('/api/metodos-venta', metodoVentaController.create); // Crear un nuevo método de venta
app.put('/api/metodos-venta/:id', metodoVentaController.update); // Actualizar un método de venta por ID
app.delete('/api/metodos-venta/:id', metodoVentaController.delete); // Eliminar un método de venta por ID

// Manejo de errores 404 para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores genéricos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal', error: err.message });
});

// Exportar la aplicación para que pueda ser utilizada en las pruebas y el servidor
module.exports = app;

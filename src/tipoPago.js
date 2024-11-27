const express = require('express');
const cors = require('cors');
const tiposPagoController = require('../controllers/tipoPagoController');

const app = express(); // Crear la aplicación de Express

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Rutas para tipos de pago
app.get('/api/tipos-pago', tiposPagoController.getAll); // Obtener todos los tipos de pago
app.get('/api/tipos-pago/:id', tiposPagoController.getById); // Obtener un tipo de pago por ID
app.post('/api/tipos-pago', tiposPagoController.create); // Crear un nuevo tipo de pago
app.put('/api/tipos-pago/:id', tiposPagoController.update); // Actualizar un tipo de pago por ID
app.delete('/api/tipos-pago/:id', tiposPagoController.delete); // Eliminar un tipo de pago por ID

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

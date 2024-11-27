const express = require('express');
const cors = require('cors');
const proveedoresController = require('../controllers/proveedoresController');

const app = express(); // Crear la aplicación de Express

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Rutas para proveedores
app.get('/api/proveedores', proveedoresController.getAll); // Obtener todos los proveedores
app.get('/api/proveedores/:id', proveedoresController.getById); // Obtener un proveedor por ID
app.post('/api/proveedores', proveedoresController.create); // Crear un nuevo proveedor
app.put('/api/proveedores/:id', proveedoresController.update); // Actualizar un proveedor por ID
app.delete('/api/proveedores/:id', proveedoresController.delete); // Eliminar un proveedor por ID

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

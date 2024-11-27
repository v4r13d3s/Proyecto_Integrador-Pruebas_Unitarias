const express = require('express');
const cors = require('cors');
const RolesController = require('../controllers/rolesController');

const app = express(); // Crear la aplicación de Express

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Rutas para Roles
app.get('/api/roles', RolesController.getAll); // Obtener todos los roles
app.get('/api/roles/:id', RolesController.getById); // Obtener un rol por ID
app.post('/api/roles', RolesController.create); // Crear un nuevo rol
app.put('/api/roles/:id', RolesController.update); // Actualizar un rol por ID
app.delete('/api/roles/:id', RolesController.delete); // Eliminar un rol por ID

// Manejo de errores 404 para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores genéricos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal', error: err.message });
});

// Exportar la aplicación para pruebas y servidor
module.exports = app;

const express = require('express');
const cors = require('cors');
const usuariosController = require('../controllers/usuariosController');
const router = express.Router();

const app = express();

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Definir las rutas para usuarios
router.get('/api/usuarios', usuariosController.getAll); // Obtener todos los usuarios
router.get('/api/usuarios/:id', usuariosController.getById); // Obtener un usuario por ID
router.post('/api/usuarios', usuariosController.create); // Crear un nuevo usuario
router.put('/api/usuarios/:id', usuariosController.update); // Actualizar un usuario por ID
router.delete('/api/usuarios/:id', usuariosController.delete); // Eliminar un usuario por ID

// Manejo de errores 404 para rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
  });
  
  // Middleware de manejo de errores genéricos
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal', error: err.message });
  });

module.exports = router;

const express = require('express');
const cors = require('cors');
const rolesController = require('../controllers/rolesController');
const router = express.Router();

const app = express();

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Definir las rutas para roles
router.get('/api/roles', rolesController.getAll); // Obtener todos los roles
router.get('/api/roles/:id', rolesController.getById); // Obtener un rol por ID
router.post('/api/roles', rolesController.create); // Crear un nuevo rol
router.put('/api/roles/:id', rolesController.update); // Actualizar un rol por ID
router.delete('/api/roles/:id', rolesController.delete); // Eliminar un rol por ID

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

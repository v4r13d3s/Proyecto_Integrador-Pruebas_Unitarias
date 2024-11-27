const express = require('express');
const cors = require('cors');
const empleadosController = require('../controllers/empleadosController.js');
const router = express.Router();

const app = express();

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Definir las rutas para empleados
router.get('/api/empleados', empleadosController.getAll); // Obtener todos los empleados
router.get('/api/empleados/:id', empleadosController.getById); // Obtener un empleado por ID
router.post('/api/empleados', empleadosController.create); // Crear un nuevo empleado
router.put('/api/empleados/:id', empleadosController.update); // Actualizar un empleado por ID
router.delete('/api/empleados/:id', empleadosController.delete); // Eliminar un empleado por ID

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
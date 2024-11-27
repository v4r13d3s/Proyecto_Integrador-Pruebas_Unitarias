const express = require('express');
const cors = require('cors');
const metodoVentaController = require('../controllers/metodoVentaController');
const router = express.Router();

const app = express();

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Definir las rutas para métodos de venta
router.get('/api/metodoVenta', metodoVentaController.getAll); // Obtener todos los métodos de venta
router.get('/api/metodoVenta/:id', metodoVentaController.getById); // Obtener un método de venta por ID
router.post('/api/metodoVenta', metodoVentaController.create); // Crear un nuevo método de venta
router.put('/api/metodoVenta/:id', metodoVentaController.update); // Actualizar un método de venta por ID
router.delete('/api/metodoVenta/:id', metodoVentaController.delete); // Eliminar un método de venta por ID

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
const express = require('express');
const cors = require('cors');
const ventasController = require('../controllers/ventasController');
const router = express.Router();

const app = express();

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Definir las rutas para ventas
router.get('/api/ventas', ventasController.getAll); // Obtener todas las ventas
router.get('/api/ventas/:folio', ventasController.getById); // Obtener una venta por folio
router.post('/api/ventas', ventasController.create); // Crear una nueva venta
router.put('/api/ventas/:folio', ventasController.update); // Actualizar una venta por folio
router.delete('/api/ventas/:folio', ventasController.delete); // Eliminar una venta por folio

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

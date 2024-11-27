const express = require('express');
const cors = require('cors');
const tipoPagoController = require('../controllers/tipoPagoController');
const router = express.Router();

const app = express();

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Definir las rutas para tipos de pago
router.get('/api/tipoPago', tipoPagoController.getAll); // Obtener todos los tipos de pago
router.get('/api/tipoPago/:id', tipoPagoController.getById); // Obtener un tipo de pago por ID
router.post('/api/tipoPago', tipoPagoController.create); // Crear un nuevo tipo de pago
router.put('/api/tipoPago/:id', tipoPagoController.update); // Actualizar un tipo de pago por ID
router.delete('/api/tipoPago/:id', tipoPagoController.delete); // Eliminar un tipo de pago por ID

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

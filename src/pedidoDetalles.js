const express = require('express');
const cors = require('cors');
const pedidoDetalleController = require('../controllers/pedidoDetalleController');
const router = express.Router();

const app = express();

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Definir las rutas para detalles de pedidos
router.get('/api/pedidoDetalles', pedidoDetalleController.getAll); // Obtener todos los detalles de pedidos
router.get('/api/pedidoDetalles/:idPedido/:idProducto', pedidoDetalleController.getById); // Obtener un detalle de pedido por ID
router.post('/api/pedidoDetalles', pedidoDetalleController.create); // Crear un nuevo detalle de pedido
router.put('/api/pedidoDetalles/:idPedido/:idProducto', pedidoDetalleController.update); // Actualizar un detalle de pedido
router.delete('/api/pedidoDetalles/:idPedido/:idProducto', pedidoDetalleController.delete); // Eliminar un detalle de pedido

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

const express = require('express');
const cors = require('cors');
const pedidosController = require('../controllers/pedidosController');
const router = express.Router();

const app = express();

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Definir las rutas para pedidos
router.get('/api/pedidos', pedidosController.getAll); // Obtener todos los pedidos
router.get('/api/pedidos/:id', pedidosController.getById); // Obtener un pedido por ID
router.post('/api/pedidos', pedidosController.create); // Crear un nuevo pedido
router.put('/api/pedidos/:id', pedidosController.update); // Actualizar un pedido por ID
router.delete('/api/pedidos/:id', pedidosController.delete); // Eliminar un pedido por ID

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

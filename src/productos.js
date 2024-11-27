const express = require('express');
const cors = require('cors');
const productosController = require('../controllers/productosController');
const router = express.Router();

const app = express();

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Definir las rutas para productos
router.get('/api/productos', productosController.getAll); // Obtener todos los productos
router.get('/api/productos/:id', productosController.getById); // Obtener un producto por ID
router.post('/api/productos', productosController.create); // Crear un nuevo producto
router.put('/api/productos/:id', productosController.update); // Actualizar un producto por ID
router.delete('/api/productos/:id', productosController.delete); // Eliminar un producto por ID

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

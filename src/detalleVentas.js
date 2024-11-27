const express = require('express');
const cors = require('cors');
const detalleVentasController = require('../controllers/detalleVentasController');

const app = express();

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Definir las rutas para detalle de ventas
app.get('/api/detalleVentas', detalleVentasController.getAll); // Obtener todos los detalles de ventas
app.get('/api/detalleVentas/:folio/:idProducto', detalleVentasController.getById); // Obtener un detalle por folio y ID de producto
app.post('/api/detalleVentas', detalleVentasController.create); // Crear un nuevo detalle de venta
app.put('/api/detalleVentas/:folio/:idProducto', detalleVentasController.update); // Actualizar un detalle por folio y ID de producto
app.delete('/api/detalleVentas/:folio/:idProducto', detalleVentasController.delete); // Eliminar un detalle por folio y ID de producto

// Manejo de errores 404 para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores genéricos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal', error: err.message });
});

// Exportar la app para pruebas y el servidor
module.exports = app;

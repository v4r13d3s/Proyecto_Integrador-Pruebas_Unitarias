const express = require('express');
const cors = require('cors');
const pedidoDetallesController = require('../controllers/pedidoDetallesController.js');

const app = express(); // Crear la aplicación de Express

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Rutas para Detalles de Pedido
app.get('/api/pedido-detalles', pedidoDetallesController.getAll); // Obtener todos los detalles de pedidos
app.get('/api/pedido-detalles/:idPedido/:idProducto', pedidoDetallesController.getById); // Obtener un detalle de pedido por ID
app.post('/api/pedido-detalles', pedidoDetallesController.create); // Crear un nuevo detalle de pedido
app.put('/api/pedido-detalles/:idPedido/:idProducto', pedidoDetallesController.update); // Actualizar un detalle de pedido por ID
app.delete('/api/pedido-detalles/:idPedido/:idProducto', pedidoDetallesController.delete); // Eliminar un detalle de pedido por ID

// Manejo de errores 404 para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores genéricos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal', error: err.message });
});

// Exportar la aplicación para que pueda ser utilizada en las pruebas y el servidor
module.exports = app;

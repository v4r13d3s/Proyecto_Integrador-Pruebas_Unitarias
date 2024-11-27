const PedidoDetalles = require('../models/pedidoDetallesModel');
const db = require('../config/database');

// Helper para validar campos obligatorios
const validateFields = (fields, res) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || (key === 'cantidad' && value <= 0)) {
      res.status(400).json({ message: `El campo ${key} es obligatorio y debe ser válido.` });
      return false;
    }
  }
  return true;
};

class PedidoDetalleController {
  static async getAll(req, res) {
    try {
      const detalles = await PedidoDetalles.findAll();
      if (detalles.length === 0) {
        return res.status(404).json({ message: 'No hay detalles de pedidos registrados.' });
      }
      res.status(200).json(detalles);
    } catch (error) {
      console.error('Error al obtener los detalles de pedidos:', error);
      res.status(500).json({ message: 'Error interno al obtener los detalles de pedidos.' });
    }
  }

  static async getById(req, res) {
    const { idPedido, idProducto } = req.params;

    if (!validateFields({ idPedido, idProducto }, res)) return;

    try {
      const detalle = await PedidoDetalles.findById(idPedido, idProducto);
      if (!detalle) {
        return res.status(404).json({ message: 'Detalle de pedido no encontrado.' });
      }
      res.status(200).json(detalle);
    } catch (error) {
      console.error('Error al obtener el detalle de pedido:', error);
      res.status(500).json({ message: 'Error interno al obtener el detalle de pedido.' });
    }
  }

  static async create(req, res) {
    const { idPedido, idProducto, cantidad } = req.body;

    if (!validateFields({ idPedido, idProducto, cantidad }, res)) return;

    try {
      const newDetalle = await PedidoDetalles.create(req.body);
      res.status(201).json(newDetalle);
    } catch (error) {
      console.error('Error al crear el detalle de pedido:', error.message);
      res.status(error.message.includes('ya existe') || error.message.includes('Stock insuficiente') || error.message.includes('no existe') ? 400 : 500)
        .json({ message: error.message });
    }
  }

  static async update(req, res) {
    const { idPedido, idProducto } = req.params;
    const { cantidad } = req.body;

    if (!validateFields({ idPedido, idProducto, cantidad }, res)) return;

    try {
      const updatedDetalle = await PedidoDetalles.update(idPedido, idProducto, { cantidad });
      res.status(200).json(updatedDetalle);
    } catch (error) {
      console.error('Error al actualizar el detalle de pedido:', error.message);
      res.status(error.message.includes('no existe') || error.message.includes('Stock insuficiente') ? 400 : 500)
        .json({ message: error.message });
    }
  }

  static async delete(req, res) {
    const { idPedido, idProducto } = req.params;

    if (!validateFields({ idPedido, idProducto }, res)) return;

    try {
      await PedidoDetalles.delete(idPedido, idProducto);
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar el detalle de pedido:', error.message);
      res.status(error.message.includes('no existe') ? 404 : 500).json({ message: error.message });
    }
  }
}

module.exports = PedidoDetalleController;

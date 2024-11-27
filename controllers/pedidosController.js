const Pedidos = require('../models/pedidosModel');

class PedidosController {
  static async getAll(req, res) {
    try {
      const pedidos = await Pedidos.findAll();
      res.status(200).json(pedidos);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const pedido = await Pedidos.findById(req.params.id);
      if (!pedido) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(pedido);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving order', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newPedido = await Pedidos.create(req.body);
      res.status(201).json(newPedido);
    } catch (error) {
      res.status(500).json({ message: 'Error creating order', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const updatedPedido = await Pedidos.update(req.params.id, req.body);
      if (!updatedPedido) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(updatedPedido);
    } catch (error) {
      res.status(500).json({ message: 'Error updating order', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deletedPedido = await Pedidos.delete(req.params.id);
      if (!deletedPedido) return res.status(404).json({ message: 'Order not found' });
      res.status(204).json(); // No content for successful deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
  }
}

module.exports = PedidosController;



const PedidoDetalle = require('../models/pedidoDetallesModel');


class PedidoDetalleController {
  static async getAll(req, res) {
    try {
      const detalles = await PedidoDetalle.findAll();
      res.status(200).json(detalles);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving order details', error: error.message });
    }
  }

  static async getById(req, res) {
    const { idPedido, idProducto } = req.params;
    try {
        const detalle = await PedidoDetalles.findById(idPedido, idProducto);
        if (!detalle) return res.status(404).json({ message: 'Order detail not found' });
        res.status(200).json(detalle);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving order detail', error: error.message });
    }
}

  static async create(req, res) {
    try {
      const newDetalle = await PedidoDetalle.create(req.body);
      res.status(201).json(newDetalle);
    } catch (error) {
      res.status(500).json({ message: 'Error creating order detail', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const updatedDetalle = await PedidoDetalle.update(req.params.idPedido, req.params.idProducto, req.body);
      if (!updatedDetalle) return res.status(404).json({ message: 'Order detail not found' });
      res.status(200).json(updatedDetalle);
    } catch (error) {
      res.status(500).json({ message: 'Error updating order detail', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deletedDetalle = await PedidoDetalle.delete(req.params.idPedido, req.params.idProducto);
      if (!deletedDetalle) return res.status(404).json({ message: 'Order detail not found' });
      res.status(204).json(); // No content for successful deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting order detail', error: error.message });
    }
  }
}

module.exports = PedidoDetalleController;




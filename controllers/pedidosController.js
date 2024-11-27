const Pedidos = require('../models/pedidosModel');

class PedidosController {
  static async getAll(req, res) {
    try {
      const pedidos = await Pedidos.findAll();
      res.status(200).json(pedidos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los pedidos' });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;

    try {
      const pedido = await Pedidos.findById(id);
      if (!pedido) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      res.status(200).json(pedido);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el pedido' });
    }
  }

  static async create(req, res) {
    const { total, estado, idMetodoV, idProveedor } = req.body;

    if (!total || !estado || !idMetodoV || !idProveedor) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
      const newPedido = await Pedidos.create(req.body);
      res.status(201).json(newPedido);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el pedido' });
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { total, estado, idMetodoV, idProveedor } = req.body;

    if (!total || !estado || !idMetodoV || !idProveedor) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
      const updatedPedido = await Pedidos.update(id, req.body);
      if (!updatedPedido) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      res.status(200).json(updatedPedido);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el pedido' });
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    try {
      const deletedPedido = await Pedidos.delete(id);
      if (!deletedPedido) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el pedido' });
    }
  }
}

module.exports = PedidosController;

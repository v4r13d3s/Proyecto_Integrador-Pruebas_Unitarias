const Ventas = require('../models/ventasModel');

class VentasController {
  static async getAll(req, res) {
    try {
      const ventas = await Ventas.findAll();
      res.status(200).json(ventas);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving sales', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const venta = await Ventas.findById(req.params.folio);
      if (!venta) return res.status(404).json({ message: 'Sale not found' });
      res.status(200).json(venta);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving sale', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newVenta = await Ventas.create(req.body);
      res.status(201).json(newVenta);
    } catch (error) {
      res.status(500).json({ message: 'Error creating sale', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const updatedVenta = await Ventas.update(req.params.folio, req.body);
      if (!updatedVenta) return res.status(404).json({ message: 'Sale not found' });
      res.status(200).json(updatedVenta);
    } catch (error) {
      res.status(500).json({ message: 'Error updating sale', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deletedVenta = await Ventas.delete(req.params.folio);
      if (!deletedVenta) return res.status(404).json({ message: 'Sale not found' });
      res.status(204).json(); // No content for successful deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting sale', error: error.message });
    }
  }
}

module.exports = VentasController;



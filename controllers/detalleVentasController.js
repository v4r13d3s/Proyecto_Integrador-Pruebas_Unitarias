const DetalleVentas = require('../models/detalleVentasModel');

class DetalleVentasController {
  static async getAll(req, res) {
    try {
      const detalles = await DetalleVentas.findAll();
      res.status(200).json(detalles);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving sales details', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const detalle = await DetalleVentas.findById(req.params.folio, req.params.idProducto);
      if (!detalle) return res.status(404).json({ message: 'Detail not found' });
      res.status(200).json(detalle);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving detail', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newDetalle = await DetalleVentas.create(req.body);
      res.status(201).json(newDetalle);
    } catch (error) {
      res.status(500).json({ message: 'Error creating detail', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const updatedDetalle = await DetalleVentas.update(req.params.folio, req.params.idProducto, req.body);
      if (!updatedDetalle) return res.status(404).json({ message: 'Detail not found' });
      res.status(200).json(updatedDetalle);
    } catch (error) {
      res.status(500).json({ message: 'Error updating detail', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deletedDetalle = await DetalleVentas.delete(req.params.folio, req.params.idProducto);
      if (!deletedDetalle) return res.status(404).json({ message: 'Detail not found' });
      res.status(204).json(); // No content for successful deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting detail', error: error.message });
    }
  }
}

module.exports = DetalleVentasController;


const TiposPago = require('../models/tipoPagoModel');

class TiposPagoController {
  static async getAll(req, res) {
    try {
      const tipos = await TiposPago.findAll();
      res.status(200).json(tipos);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving payment types', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const tipo = await TiposPago.findById(req.params.id);
      if (!tipo) return res.status(404).json({ message: 'Payment type not found' });
      res.status(200).json(tipo);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving payment type', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newTipo = await TiposPago.create(req.body);
      res.status(201).json(newTipo);
    } catch (error) {
      res.status(500).json({ message: 'Error creating payment type', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const updatedTipo = await TiposPago.update(req.params.id, req.body);
      if (!updatedTipo) return res.status(404).json({ message: 'Payment type not found' });
      res.status(200).json(updatedTipo);
    } catch (error) {
      res.status(500).json({ message: 'Error updating payment type', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deletedTipo = await TiposPago.delete(req.params.id);
      if (!deletedTipo) return res.status(404).json({ message: 'Payment type not found' });
      res.status(204).json(); // No content for successful deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting payment type', error: error.message });
    }
  }
}

module.exports = TiposPagoController;



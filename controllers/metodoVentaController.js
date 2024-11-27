const MetodoVenta = require('../models/metodoVentaModel');

class MetodoVentaController {
  static async getAll(req, res) {
    try {
      const metodos = await MetodoVenta.findAll();
      res.status(200).json(metodos);  // Devuelve todos los métodos de venta
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving sales methods', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const metodo = await MetodoVenta.findById(req.params.id);
      if (!metodo) return res.status(404).json({ message: 'Method not found' });
      res.status(200).json(metodo);  // Devuelve un método de venta por su ID
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving method', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newMetodo = await MetodoVenta.create(req.body);  // Crea un nuevo método de venta
      res.status(201).json(newMetodo);
    } catch (error) {
      res.status(500).json({ message: 'Error creating method', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const updatedMetodo = await MetodoVenta.update(req.params.id, req.body);  // Actualiza un método de venta
      if (!updatedMetodo) return res.status(404).json({ message: 'Method not found' });
      res.status(200).json(updatedMetodo);
    } catch (error) {
      res.status(500).json({ message: 'Error updating method', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deletedMetodo = await MetodoVenta.delete(req.params.id);  // Elimina un método de venta por su ID
      if (!deletedMetodo) return res.status(404).json({ message: 'Method not found' });
      res.status(204).json();  // Respuesta vacía para eliminación exitosa
    } catch (error) {
      res.status(500).json({ message: 'Error deleting method', error: error.message });
    }
  }
}

module.exports = MetodoVentaController;




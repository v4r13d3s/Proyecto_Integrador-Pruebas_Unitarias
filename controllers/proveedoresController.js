const Proveedores = require('../models/proveedoresModel');

class ProveedoresController {
  static async getAll(req, res) {
    try {
      const proveedores = await Proveedores.findAll();
      res.status(200).json(proveedores);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving suppliers', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const proveedor = await Proveedores.findById(req.params.id);
      if (!proveedor) return res.status(404).json({ message: 'Supplier not found' });
      res.status(200).json(proveedor);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving supplier', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newProveedor = await Proveedores.create(req.body);
      res.status(201).json(newProveedor);
    } catch (error) {
      res.status(500).json({ message: 'Error creating supplier', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const updatedProveedor = await Proveedores.update(req.params.id, req.body);
      if (!updatedProveedor) return res.status(404).json({ message: 'Supplier not found' });
      res.status(200).json(updatedProveedor);
    } catch (error) {
      res.status(500).json({ message: 'Error updating supplier', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deletedProveedor = await Proveedores.delete(req.params.id);
      if (!deletedProveedor) return res.status(404).json({ message: 'Supplier not found' });
      res.status(204).json(); // No content for successful deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting supplier', error: error.message });
    }
  }
}

module.exports = ProveedoresController;


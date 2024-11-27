const Productos = require('../models/productosModel');

class ProductosController {
  static async getAll(req, res) {
    try {
      const productos = await Productos.findAll();
      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const producto = await Productos.findById(req.params.id);
      if (!producto) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(producto);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving product', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newProducto = await Productos.create(req.body);
      res.status(201).json(newProducto);
    } catch (error) {
      res.status(500).json({ message: 'Error creating product', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const updatedProducto = await Productos.update(req.params.id, req.body);
      if (!updatedProducto) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(updatedProducto);
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deletedProducto = await Productos.delete(req.params.id);
      if (!deletedProducto) return res.status(404).json({ message: 'Product not found' });
      res.status(204).json(); // No content for successful deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
  }
}

module.exports = ProductosController;

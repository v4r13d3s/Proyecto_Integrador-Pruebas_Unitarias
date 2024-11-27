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
    const { nombre, descripcion, precio, stock, idcategoria } = req.body;
  
    // Validar datos obligatorios
    if (!nombre || !descripcion || !precio || !stock || !idcategoria) {
      return res.status(400).json({
        message: 'Todos los campos (nombre, descripcion, precio, stock, idcategoria) son obligatorios.',
      });
    }
  
    // Validar que los datos sean del tipo correcto
    if (typeof precio !== 'number' || precio <= 0) {
      return res.status(400).json({
        message: 'El precio debe ser un número mayor a 0.',
      });
    }
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        message: 'El stock debe ser un número mayor o igual a 0.',
      });
    }
  
    try {
      const newProducto = await Productos.create(req.body);
      res.status(201).json(newProducto);
    } catch (error) {
      // Validar si el error es por clave foránea
      if (error.message.includes('foreign key constraint')) {
        return res.status(400).json({
          message: 'El idcategoria proporcionado no es válido.',
        });
      }
      res.status(500).json({
        message: 'Error creando el producto.',
        error: error.message,
      });
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

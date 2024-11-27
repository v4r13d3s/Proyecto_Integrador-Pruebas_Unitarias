const Categorias = require('../models/categoriasModel');

class CategoriasController {
  static async getAll(req, res) {
    try {
      const categorias = await Categorias.findAll();
      res.status(200).json(categorias);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving categories', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const categoria = await Categorias.findById(req.params.id);
      if (!categoria) return res.status(404).json({ message: 'Categoría no encontrada' });
      res.status(200).json(categoria);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener categoría', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newCategoria = await Categorias.create(req.body);
      res.status(201).json(newCategoria);
    } catch (error) {
      res.status(500).json({ message: 'Error creating category', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const updatedCategoria = await Categorias.update(req.params.id, req.body);
      console.log('Categoría actualizada:', updatedCategoria); 
      if (!updatedCategoria) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      res.status(200).json(updatedCategoria);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar categoría', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deletedCategoria = await Categorias.delete(req.params.id);
      if (!deletedCategoria) return res.status(404).json({ message: 'Category not found' });
      res.status(204).json(); 
    } catch (error) {
      res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
  }
}

module.exports = CategoriasController;


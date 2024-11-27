const Usuarios = require('../models/usuariosModel');

class UsuariosController {
  static async getAll(req, res) {
    try {
      const usuarios = await Usuarios.findAll();
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error); // Registro del error
      res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const usuario = await Usuarios.findById(req.params.id);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.status(200).json(usuario);
    } catch (error) {
      console.error('Error al obtener usuario:', error); // Registro del error
      res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newUsuario = await Usuarios.create(req.body);
      res.status(201).json(newUsuario);
    } catch (error) {
      console.error('Error al crear usuario:', error); // Registro del error
      res.status(500).json({ message: 'Error al crear usuario', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const updatedUsuario = await Usuarios.update(req.params.id, req.body);
      if (!updatedUsuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.status(200).json(updatedUsuario);
    } catch (error) {
      console.error('Error al actualizar usuario:', error); // Registro del error
      res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deletedUsuario = await Usuarios.delete(req.params.id);
      if (!deletedUsuario) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.status(204).send(); // No content for successful deletion
    } catch (error) {
      console.error('Error al eliminar usuario:', error); // Registro del error
      res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
  }
}

module.exports = UsuariosController;


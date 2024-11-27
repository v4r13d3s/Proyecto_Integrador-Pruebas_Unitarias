const Roles = require('../models/rolesModel');

class RolesController {
  // Método para obtener todos los roles
  static async getAll(req, res) {
    try {
      const roles = await Roles.findAll();
      res.status(200).json(roles);
    } catch (error) {
      console.error('Error al obtener los roles:', error.message);
      res.status(500).json({ message: 'Error al obtener los roles.', error: error.message });
    }
  }

  // Método para obtener un rol por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const rol = await Roles.findById(id);
      if (!rol) {
        return res.status(404).json({ message: `Rol con ID ${id} no encontrado.` });
      }
      res.status(200).json(rol);
    } catch (error) {
      console.error('Error al obtener el rol:', error.message);
      res.status(500).json({ message: 'Error al obtener el rol.', error: error.message });
    }
  }

  // Método para crear un nuevo rol
  static async create(req, res) {
    try {
      const { tipo } = req.body;

      // Validación de que el campo 'tipo' está presente
      if (!tipo) {
        return res.status(400).json({ message: 'El campo "tipo" es obligatorio.' });
      }

      const nuevoRol = await Roles.create({ tipo });
      res.status(201).json(nuevoRol);
    } catch (error) {
      console.error('Error al crear el rol:', error.message);
      res.status(500).json({ message: 'Error al crear el rol.', error: error.message });
    }
  }

  // Método para actualizar un rol
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { tipo } = req.body;

      if (!tipo) {
        return res.status(400).json({ message: 'El campo "tipo" es obligatorio.' });
      }

      const rolActualizado = await Roles.update(id, { tipo });
      if (!rolActualizado) {
        return res.status(404).json({ message: `Rol con ID ${id} no encontrado.` });
      }

      res.status(200).json(rolActualizado);
    } catch (error) {
      console.error('Error al actualizar el rol:', error.message);
      res.status(500).json({ message: 'Error al actualizar el rol.', error: error.message });
    }
  }

  // Método para eliminar un rol
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const rolEliminado = await Roles.delete(id);
      if (!rolEliminado) {
        return res.status(404).json({ message: `Rol con ID ${id} no encontrado.` });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar el rol:', error.message);
      res.status(500).json({ message: 'Error al eliminar el rol.', error: error.message });
    }
  }
}

module.exports = RolesController;

const Roles = require('../models/rolesModel');

class RolesController {
  static async getAll(req, res) {
    try {
      const roles = await Roles.findAll();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving roles', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const rol = await Roles.findById(req.params.id);
      if (!rol) return res.status(404).json({ message: 'Role not found' });
      res.status(200).json(rol);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving role', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newRol = await Roles.create(req.body);
      res.status(201).json(newRol);
    } catch (error) {
      res.status(500).json({ message: 'Error creating role', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const updatedRol = await Roles.update(req.params.id, req.body);
      if (!updatedRol) return res.status(404).json({ message: 'Role not found' });
      res.status(200).json(updatedRol);
    } catch (error) {
      res.status(500).json({ message: 'Error updating role', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deletedRol = await Roles.delete(req.params.id);
      if (!deletedRol) return res.status(404).json({ message: 'Role not found' });
      res.status(204).json(); // No content for successful deletion
    } catch (error) {
      res.status(500).json({ message: 'Error deleting role', error: error.message });
    }
  }
}

module.exports = RolesController;


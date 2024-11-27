const Empleados = require('../models/empleadosModel');

class EmpleadosController {
  static async getAll(req, res) {
    try {
      const empleados = await Empleados.findAll();
      res.status(200).json(empleados);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      res.status(500).json({ message: 'Error al obtener empleados', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const empleado = await Empleados.findById(req.params.id);
      if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });
      res.status(200).json(empleado);
    } catch (error) {
      console.error('Error al obtener empleado:', error);
      res.status(500).json({ message: 'Error al obtener empleado', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newEmpleado = await Empleados.create(req.body);
      res.status(201).json(newEmpleado);
    } catch (error) {
      console.error('Error al crear empleado:', error);
      res.status(500).json({ message: 'Error al crear empleado', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const updatedEmpleado = await Empleados.update(req.params.id, req.body);
      if (!updatedEmpleado) return res.status(404).json({ message: 'Empleado no encontrado' });
      res.status(200).json(updatedEmpleado);
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      res.status(500).json({ message: 'Error al actualizar empleado', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deletedEmpleado = await Empleados.delete(req.params.id);
      if (!deletedEmpleado) return res.status(404).json({ message: 'Empleado no encontrado' });
      res.status(204).send(); // No content for successful deletion
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      res.status(500).json({ message: 'Error al eliminar empleado', error: error.message });
    }
  }
}

module.exports = EmpleadosController;


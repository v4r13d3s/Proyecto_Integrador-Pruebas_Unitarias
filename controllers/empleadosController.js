const Empleados = require('../models/empleadosModel');

class EmpleadosController {
  // Validar datos del empleado
  static validarDatosEmpleado(data) {
    const errores = [];

    if (!data.nombre || data.nombre.length < 3 || data.nombre.length > 25) {
      errores.push('El nombre debe tener entre 3 y 25 caracteres.');
    }

    if (!data.appaterno || data.appaterno.length < 3 || data.appaterno.length > 25) {
      errores.push('El apellido paterno debe tener entre 3 y 25 caracteres.');
    }

    if (data.apmaterno && data.apmaterno.length > 25) {
      errores.push('El apellido materno no debe exceder los 25 caracteres.');
    }

    const regexCurp = /^[A-Z]{4}\d{6}[HM][A-Z]{2}[A-Z]{3}[0-9A-Z]\d$/;
    if (!data.curp || !regexCurp.test(data.curp)) {
      errores.push('La CURP debe tener 18 caracteres y un formato válido.');
    }
        if (!data.curp || !regexCurp.test(data.curp)) {
      errores.push('La CURP debe tener 18 caracteres y un formato válido.');
    }

    const fechaNacimiento = new Date(data.fechanacimiento);
    if (isNaN(fechaNacimiento.getTime())) {
      errores.push('La fecha de nacimiento debe ser válida.');
    } else {
      const edad = new Date().getFullYear() - fechaNacimiento.getFullYear();
      if (edad < 18) {
        errores.push('El empleado debe ser mayor de 18 años.');
      }
    }

    return errores;
  }

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
      const errores = EmpleadosController.validarDatosEmpleado(req.body);
      if (errores.length > 0) {
        return res.status(400).json({ message: 'Datos inválidos', errores });
      }

      const newEmpleado = await Empleados.create(req.body);
      res.status(201).json(newEmpleado);
    } catch (error) {
      console.error('Error al crear empleado:', error);
      res.status(500).json({ message: 'Error al crear empleado', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const errores = EmpleadosController.validarDatosEmpleado(req.body);
      if (errores.length > 0) {
        return res.status(400).json({ message: 'Datos inválidos', errores });
      }

      // Validar que el empleado exista antes de intentar actualizarlo
      const empleadoExistente = await Empleados.findById(req.params.id);
      if (!empleadoExistente) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }

      const updatedEmpleado = await Empleados.update(req.params.id, req.body);
      res.status(200).json(updatedEmpleado);
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      res.status(500).json({ message: 'Error al actualizar empleado', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      // Validar que el empleado exista antes de intentar eliminarlo
      const empleadoExistente = await Empleados.findById(req.params.id);
      if (!empleadoExistente) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }

      const deletedEmpleado = await Empleados.delete(req.params.id);
      res.status(204).send(); // No content for successful deletion
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      res.status(500).json({ message: 'Error al eliminar empleado', error: error.message });
    }
  }
}

module.exports = EmpleadosController;

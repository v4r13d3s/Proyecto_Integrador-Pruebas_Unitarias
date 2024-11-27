const MetodoVenta = require('../models/metodoVentaModel');

class MetodoVentaController {
  static async getAll(req, res) {
    try {
      const metodos = await MetodoVenta.findAll();
      res.status(200).json(metodos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los métodos de venta', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const metodo = await MetodoVenta.findById(req.params.id);
      if (!metodo) return res.status(404).json({ message: 'Método no encontrado' });
      res.status(200).json(metodo);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el método de venta', error: error.message });
    }
  }

  static async create(req, res) {
    const errores = [];
    const { idTipoPago, descripcion, comision, activo } = req.body;

    // Validaciones
    if (!descripcion || descripcion.length < 5 || descripcion.length > 255) {
      errores.push('La descripción debe tener entre 5 y 255 caracteres.');
    }

    if (isNaN(comision) || comision < 0 || comision > 0.50) {
      errores.push('La comisión debe ser un número entre 0.00 y 0.50.');
    }

    if (typeof activo !== 'boolean') {
      errores.push('El campo "activo" debe ser un valor booleano (true o false).');
    }

    const tipoPagoExists = await MetodoVenta.checkTipoPagoExists(idTipoPago);
    if (!tipoPagoExists) {
      errores.push(`El tipo de pago con id ${idTipoPago} no existe.`);
    }

    if (errores.length > 0) {
      return res.status(400).json({ message: 'Datos inválidos', errores });
    }

    try {
      const newMetodo = await MetodoVenta.create(req.body);
      res.status(201).json(newMetodo);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el método de venta', error: error.message });
    }
  }

  static async update(req, res) {
    const errores = [];
    const { idTipoPago, descripcion, comision, activo } = req.body;

    // Validaciones
    if (!descripcion || descripcion.length < 5 || descripcion.length > 255) {
      errores.push('La descripción debe tener entre 5 y 255 caracteres.');
    }

    if (isNaN(comision) || comision < 0 || comision > 0.50) {
      errores.push('La comisión debe ser un número entre 0.00 y 0.50.');
    }

    if (typeof activo !== 'boolean') {
      errores.push('El campo "activo" debe ser un valor booleano (true o false).');
    }

    const tipoPagoExists = await MetodoVenta.checkTipoPagoExists(idTipoPago);
    if (!tipoPagoExists) {
      errores.push(`El tipo de pago con id ${idTipoPago} no existe.`);
    }

    if (errores.length > 0) {
      return res.status(400).json({ message: 'Datos inválidos', errores });
    }

    try {
      const updatedMetodo = await MetodoVenta.update(req.params.id, req.body);
      if (!updatedMetodo) return res.status(404).json({ message: 'Método no encontrado' });
      res.status(200).json(updatedMetodo);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el método de venta', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deletedMetodo = await MetodoVenta.delete(req.params.id);
      if (!deletedMetodo) return res.status(404).json({ message: 'Método no encontrado' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el método de venta', error: error.message });
    }
  }
}

module.exports = MetodoVentaController;

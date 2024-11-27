const TipoPago = require('../models/tipoPagoModel');

class TiposPagoController {
  static async getAll(req, res) {
    try {
      const tipos = await TipoPago.findAll();
      res.status(200).json(tipos);
    } catch (error) {
      console.error('Error en getAll:', error.message);
      res.status(500).json({ message: 'Error al obtener los tipos de pago.', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido. Debe ser un número.' });
      }

      const tipo = await TipoPago.findById(id);
      if (!tipo) {
        return res.status(404).json({ message: 'Tipo de pago no encontrado.' });
      }

      res.status(200).json(tipo);
    } catch (error) {
      console.error('Error en getById:', error.message);
      res.status(500).json({ message: 'Error al obtener el tipo de pago.', error: error.message });
    }
  }

  static async create(req, res) {
    const { descripcion, activo } = req.body;

    // Validaciones básicas
    const errores = [];
    if (!descripcion || typeof descripcion !== 'string' || descripcion.trim().length === 0) {
      errores.push('La descripción es obligatoria y debe ser una cadena no vacía.');
    }
    if (typeof activo !== 'boolean') {
      errores.push('El campo "activo" debe ser un valor booleano.');
    }

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    try {
      const newTipo = await TipoPago.create({ descripcion, activo });
      res.status(201).json(newTipo);
    } catch (error) {
      console.error('Error en create:', error.message);
      res.status(500).json({ message: 'Error al crear el tipo de pago.', error: error.message });
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { descripcion, activo } = req.body;

    // Validaciones
    const errores = [];
    if (!id || isNaN(id)) {
      errores.push('ID inválido. Debe ser un número.');
    }
    if (!descripcion || typeof descripcion !== 'string' || descripcion.trim().length < 3) {
      errores.push('La descripción es obligatoria y debe tener al menos 3 caracteres.');
    }
    if (typeof activo !== 'boolean') {
      errores.push('El campo "activo" debe ser un valor booleano.');
    }

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    try {
      const updatedTipo = await TipoPago.update(id, { descripcion, activo });
      if (!updatedTipo) {
        return res.status(404).json({ message: 'Tipo de pago no encontrado.' });
      }

      res.status(200).json(updatedTipo);
    } catch (error) {
      console.error('Error en update:', error.message);
      res.status(500).json({ message: 'Error al actualizar el tipo de pago.', error: error.message });
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido. Debe ser un número.' });
    }

    try {
      const deletedTipo = await TipoPago.delete(id);
      if (!deletedTipo) {
        return res.status(404).json({ message: 'Tipo de pago no encontrado.' });
      }

      res.status(204).send(); // Sin contenido, indica que se eliminó correctamente
    } catch (error) {
      console.error('Error en delete:', error.message);
      res.status(500).json({ message: 'Error al eliminar el tipo de pago.', error: error.message });
    }
  }
}

module.exports = TiposPagoController;

const Ventas = require('../models/ventasModel');

class VentasController {
  static async getAll(req, res) {
    try {
      const ventas = await Ventas.findAll();
      res.status(200).json(ventas);
    } catch (error) {
      console.error('Error al obtener las ventas:', error.message);
      res.status(500).json({ message: 'Error al obtener las ventas.', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { folio } = req.params;

      if (!folio || isNaN(parseInt(folio)) || parseInt(folio) <= 0) {
        return res.status(400).json({ message: `Folio inválido: ${folio}. Debe ser un número positivo.` });
      }

      const venta = await Ventas.findById(parseInt(folio));
      if (!venta) {
        return res.status(404).json({ message: `Venta con folio ${folio} no encontrada.` });
      }

      res.status(200).json(venta);
    } catch (error) {
      console.error('Error al obtener la venta:', error.message);
      res.status(500).json({ message: 'Error al obtener la venta.', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { monto, idempleado } = req.body;

      const errores = [];
      if (!monto || typeof monto !== 'number' || monto <= 0) {
        errores.push(`El monto "${monto}" es inválido. Debe ser un número positivo.`);
      }
      if (!idempleado || isNaN(parseInt(idempleado)) || parseInt(idempleado) <= 0) {
        errores.push(`El ID del empleado "${idempleado}" es inválido. Debe ser un número válido.`);
      }

      if (errores.length > 0) {
        console.warn('Errores de validación al crear venta:', errores);
        return res.status(400).json({ errores: errores });
      }

      const nuevaVenta = await Ventas.create({ monto, idempleado: parseInt(idempleado) });
      res.status(201).json(nuevaVenta);
    } catch (error) {
      console.error('Error al crear la venta:', error.message);
      res.status(500).json({ message: 'Error al crear la venta.', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { folio } = req.params;
      const { monto, idempleado } = req.body;

      if (!folio || isNaN(parseInt(folio)) || parseInt(folio) <= 0) {
        return res.status(400).json({ message: `Folio inválido: ${folio}. Debe ser un número positivo.` });
      }

      const errores = [];
      if (!monto || typeof monto !== 'number' || monto <= 0) {
        errores.push(`El monto "${monto}" es inválido. Debe ser un número positivo.`);
      }
      if (!idempleado || isNaN(parseInt(idempleado)) || parseInt(idempleado) <= 0) {
        errores.push(`El ID del empleado "${idempleado}" es inválido. Debe ser un número válido.`);
      }

      if (errores.length > 0) {
        console.warn('Errores de validación al actualizar venta:', errores);
        return res.status(400).json({ errores: errores });
      }

      const ventaActualizada = await Ventas.update(parseInt(folio), { monto, idempleado: parseInt(idempleado) });
      if (!ventaActualizada) {
        return res.status(404).json({ message: `Venta con folio ${folio} no encontrada.` });
      }

      res.status(200).json(ventaActualizada);
    } catch (error) {
      console.error('Error al actualizar la venta:', error.message);
      res.status(500).json({ message: 'Error al actualizar la venta.', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { folio } = req.params;

      if (!folio || isNaN(parseInt(folio)) || parseInt(folio) <= 0) {
        return res.status(400).json({ message: `Folio inválido: ${folio}. Debe ser un número positivo.` });
      }

      const ventaEliminada = await Ventas.delete(parseInt(folio));
      if (!ventaEliminada) {
        return res.status(404).json({ message: `Venta con folio ${folio} no encontrada.` });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar la venta:', error.message);
      res.status(500).json({ message: 'Error al eliminar la venta.', error: error.message });
    }
  }
}

module.exports = VentasController;

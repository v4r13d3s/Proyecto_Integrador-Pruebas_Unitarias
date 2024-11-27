const Proveedores = require('../models/proveedoresModel');

class ProveedoresController {
  static validateData(data, res) {
    if (!data.nombre || data.nombre.length > 25) {
      res.status(400).json({ message: 'El nombre es obligatorio y debe tener menos de 25 caracteres.' });
      return false;
    }
    if (!data.direccion || data.direccion.length > 100) {
      res.status(400).json({ message: 'La dirección es obligatoria y debe tener menos de 100 caracteres.' });
      return false;
    }
    if (!data.rfc || data.rfc.length !== 13) {
      res.status(400).json({ message: 'El RFC es obligatorio y debe tener exactamente 13 caracteres.' });
      return false;
    }
    if (!data.telefono || data.telefono.length !== 10) {
      res.status(400).json({ message: 'El teléfono es obligatorio y debe tener exactamente 10 dígitos.' });
      return false;
    }
    return true;
  }

  static async getAll(req, res) {
    try {
      const proveedores = await Proveedores.findAll();
      if (!proveedores.length) {
        return res.status(404).json({ message: 'No se encontraron proveedores.' });
      }
      res.status(200).json(proveedores);
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
      res.status(500).json({ message: 'Error al obtener los proveedores', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const proveedor = await Proveedores.findById(req.params.id);
      if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
      res.status(200).json(proveedor);
    } catch (error) {
      console.error('Error al obtener el proveedor:', error);
      res.status(500).json({ message: 'Error al obtener el proveedor', error: error.message });
    }
  }

  static async create(req, res) {
    if (!ProveedoresController.validateData(req.body, res)) return;

    try {
      const newProveedor = await Proveedores.create(req.body);
      res.status(201).json(newProveedor);
    } catch (error) {
      console.error('Error al crear el proveedor:', error);
      res.status(500).json({ message: 'Error al crear el proveedor', error: error.message });
    }
  }

  static async update(req, res) {
    if (!ProveedoresController.validateData(req.body, res)) return;

    try {
      const updatedProveedor = await Proveedores.update(req.params.id, req.body);
      if (!updatedProveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
      res.status(200).json(updatedProveedor);
    } catch (error) {
      console.error('Error al actualizar el proveedor:', error);
      res.status(500).json({ message: 'Error al actualizar el proveedor', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const deletedProveedor = await Proveedores.delete(req.params.id);
      if (!deletedProveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error);
      res.status(500).json({ message: 'Error al eliminar el proveedor', error: error.message });
    }
  }
}

module.exports = ProveedoresController;

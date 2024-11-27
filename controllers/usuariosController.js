const Usuarios = require('../models/usuariosModel');

class UsuariosController {
  static async getAll(req, res) {
    try {
      const usuarios = await Usuarios.findAll();
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido.' });
      }

      const usuario = await Usuarios.findById(id);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

      res.status(200).json(usuario);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
  }

  static async create(req, res) {
    const { nombre, correo, password, idRol } = req.body;

    const errores = [];
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
      errores.push('Nombre inválido. Debe tener al menos 3 caracteres.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo || !emailRegex.test(correo)) {
      errores.push('Correo inválido. Debe tener un formato válido.');
    }
    if (!password || password.length < 6) {
      errores.push('Contraseña inválida. Debe tener al menos 6 caracteres.');
    }
    if (!idRol || isNaN(idRol)) {
      errores.push('ID de rol inválido.');
    }

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    try {
      const newUsuario = await Usuarios.create({ nombre, correo, password, idRol });
      res.status(201).json(newUsuario);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ message: 'Error al crear usuario', error: error.message });
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nombre, correo, password, idRol } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    const errores = [];
    if (nombre && (typeof nombre !== 'string' || nombre.trim().length < 3)) {
      errores.push('Nombre inválido. Debe tener al menos 3 caracteres.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correo && !emailRegex.test(correo)) {
      errores.push('Correo inválido. Debe tener un formato válido.');
    }
    if (password && password.length < 6) {
      errores.push('Contraseña inválida. Debe tener al menos 6 caracteres.');
    }
    if (idRol && isNaN(idRol)) {
      errores.push('ID de rol inválido.');
    }

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    try {
      const updatedUsuario = await Usuarios.update(id, { nombre, correo, password, idRol });
      if (!updatedUsuario) return res.status(404).json({ message: 'Usuario no encontrado' });

      res.status(200).json(updatedUsuario);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    try {
      const deletedUsuario = await Usuarios.delete(id);
      if (!deletedUsuario) return res.status(404).json({ message: 'Usuario no encontrado' });

      res.status(204).send(); // No content
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
  }
}

module.exports = UsuariosController;

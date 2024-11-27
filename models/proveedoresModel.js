const db = require('../config/database');

class Proveedores {
  static async findAll() {
    try {
      const result = await db.query('SELECT * FROM Proveedores');
      return result.rows;
    } catch (error) {
      throw new Error('Error al obtener los proveedores: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const result = await db.query('SELECT * FROM Proveedores WHERE idProveedor = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error al obtener el proveedor: ' + error.message);
    }
  }

  static async create(data) {
    try {
      const result = await db.query(
        'INSERT INTO Proveedores (nombre, direccion, rfc, telefono) VALUES ($1, $2, $3, $4) RETURNING *',
        [data.nombre, data.direccion, data.rfc, data.telefono]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error('Error al crear el proveedor: ' + error.message);
    }
  }

  static async update(id, data) {
    try {
      const result = await db.query(
        'UPDATE Proveedores SET nombre = $1, direccion = $2, rfc = $3, telefono = $4 WHERE idProveedor = $5 RETURNING *',
        [data.nombre, data.direccion, data.rfc, data.telefono, id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error('Error al actualizar el proveedor: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const result = await db.query('DELETE FROM Proveedores WHERE idProveedor = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error al eliminar el proveedor: ' + error.message);
    }
  }
}

module.exports = Proveedores;

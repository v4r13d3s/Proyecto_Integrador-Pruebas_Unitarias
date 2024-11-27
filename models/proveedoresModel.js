const db = require('../config/database');

class Proveedores {
  static async findAll() {
    const result = await db.query('SELECT * FROM Proveedores');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM Proveedores WHERE idProveedor = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO Proveedores (nombre, direccion, rfc, telefono) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.nombre, data.direccion, data.rfc, data.telefono]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      'UPDATE Proveedores SET nombre = $1, direccion = $2, rfc = $3, telefono = $4 WHERE idProveedor = $5 RETURNING *',
      [data.nombre, data.direccion, data.rfc, data.telefono, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM Proveedores WHERE idProveedor = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Proveedores;


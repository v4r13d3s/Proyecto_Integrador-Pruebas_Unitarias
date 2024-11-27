const db = require('../config/database');

class Roles {
  static async findAll() {
    const result = await db.query('SELECT * FROM Roles');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM Roles WHERE idRol = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO Roles (tipo) VALUES ($1) RETURNING *',
      [data.tipo]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      'UPDATE Roles SET tipo = $1 WHERE idRol = $2 RETURNING *',
      [data.tipo, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM Roles WHERE idRol = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Roles;

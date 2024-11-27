const db = require('../config/database');

class TipoPago {
  static async findAll() {
    const result = await db.query('SELECT * FROM tipoPago ORDER BY idTipoPago ASC');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM tipoPago WHERE idTipoPago = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO tipoPago (descripcion, activo, fecha_creacion) VALUES ($1, $2, NOW()) RETURNING *',
      [data.descripcion, data.activo]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      'UPDATE tipoPago SET descripcion = $1, activo = $2 WHERE idTipoPago = $3 RETURNING *',
      [data.descripcion, data.activo, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM tipoPago WHERE idTipoPago = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = TipoPago;

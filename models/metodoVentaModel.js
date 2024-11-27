const db = require('../config/database');

class MetodoVenta {
  static async findAll() {
    const result = await db.query('SELECT * FROM MetodoVenta');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM MetodoVenta WHERE idMetodoVenta = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO MetodoVenta (idTipoPago, descripcion, comision, fecha_creacion, activo) VALUES ($1, $2, $3, NOW(), $4) RETURNING *',
      [data.idTipoPago, data.descripcion, data.comision, data.activo]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      'UPDATE MetodoVenta SET idTipoPago = $1, descripcion = $2, comision = $3, activo = $4 WHERE idMetodoVenta = $5 RETURNING *',
      [data.idTipoPago, data.descripcion, data.comision, data.activo, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM MetodoVenta WHERE idMetodoVenta = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  static async checkTipoPagoExists(idTipoPago) {
    const result = await db.query('SELECT 1 FROM tipoPago WHERE idTipoPago = $1', [idTipoPago]);
    return result.rowCount > 0;
  }
}

module.exports = MetodoVenta;

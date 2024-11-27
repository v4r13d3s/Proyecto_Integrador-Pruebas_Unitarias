const db = require('../config/database');

class MetodoVenta {
  static async findAll() {
    const result = await db.query('SELECT * FROM MetodoVenta');
    return result.rows;  // Devuelve todos los métodos de venta
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM MetodoVenta WHERE idMetodoVenta = $1', [id]);
    return result.rows[0];  // Devuelve un único método de venta por su ID
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO MetodoVenta (idTipoPago, descripcion, comision, fecha_creacion, activo) VALUES ($1, $2, $3, NOW(), $4) RETURNING *',
      [data.idTipoPago, data.descripcion, data.comision, data.activo]  // fecha_creacion se establece en el momento de la inserción
    );
    return result.rows[0];  // Devuelve el nuevo método de venta creado
  }

  static async update(id, data) {
    const result = await db.query(
      'UPDATE MetodoVenta SET idTipoPago = $1, descripcion = $2, comision = $3, activo = $4 WHERE idMetodoVenta = $5 RETURNING *',
      [data.idTipoPago, data.descripcion, data.comision, data.activo, id]  // No se actualiza fecha_creacion
    );
    return result.rows[0];  // Devuelve el método de venta actualizado
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM MetodoVenta WHERE idMetodoVenta = $1 RETURNING *', [id]);
    return result.rows[0];  // Devuelve el método de venta eliminado
  }
}

module.exports = MetodoVenta;




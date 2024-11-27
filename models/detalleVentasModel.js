const db = require('../config/database');

class DetalleVentas {
  static async findAll() {
    const result = await db.query('SELECT * FROM DetalleVentas');
    return result.rows;
  }

  static async findById(folio, idProducto) {
    const result = await db.query('SELECT * FROM DetalleVentas WHERE folio = $1 AND idProducto = $2', [folio, idProducto]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO DetalleVentas (folio, idProducto, cantidad, total) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.folio, data.idProducto, data.cantidad, data.total]
    );
    return result.rows[0];
  }

  static async update(folio, idProducto, data) {
    const result = await db.query(
      'UPDATE DetalleVentas SET cantidad = $1, total = $2 WHERE folio = $3 AND idProducto = $4 RETURNING *',
      [data.cantidad, data.total, folio, idProducto]
    );
    return result.rows[0];
  }

  static async delete(folio, idProducto) {
    const result = await db.query('DELETE FROM DetalleVentas WHERE folio = $1 AND idProducto = $2 RETURNING *', [folio, idProducto]);
    return result.rows[0];
  }
}

module.exports = DetalleVentas;



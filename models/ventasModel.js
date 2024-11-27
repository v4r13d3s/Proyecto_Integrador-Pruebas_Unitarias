const db = require('../config/database');

class Ventas {
  static async findAll() {
    const result = await db.query('SELECT * FROM Ventas');
    return result.rows;
  }

  static async findById(folio) {
    const result = await db.query('SELECT * FROM Ventas WHERE folio = $1', [folio]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO Ventas (monto, idempleado, fechaVenta) VALUES ($1, $2, NOW()) RETURNING *',
      [data.monto, data.idempleado] 
    );
    return result.rows[0];
  }

  static async update(folio, data) {
    const result = await db.query(
      'UPDATE Ventas SET monto = $1, idempleado = $2 WHERE folio = $3 RETURNING *',
      [data.monto, data.idempleado, folio]
    );
    return result.rows[0];
  }

  static async delete(folio) {
    const result = await db.query('DELETE FROM Ventas WHERE folio = $1 RETURNING *', [folio]);
    return result.rows[0];
  }
}

module.exports = Ventas;



const db = require('../config/database');

class Pedidos {
  static async findAll() {
    const result = await db.query('SELECT * FROM Pedidos');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM Pedidos WHERE idPedido = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO Pedidos (total, estado, fechaPedido, idMetodoV, idProveedor) VALUES ($1, $2, NOW(), $3, $4) RETURNING *',
      [data.total, data.estado, data.idMetodoV, data.idProveedor]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      'UPDATE Pedidos SET total = $1, estado = $2, fechaPedido = $3, idMetodoV = $4, idProveedor = $5 WHERE idPedido = $6 RETURNING *',
      [data.total, data.estado, data.fechaPedido || 'NOW()', data.idMetodoV, data.idProveedor, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM Pedidos WHERE idPedido = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Pedidos;



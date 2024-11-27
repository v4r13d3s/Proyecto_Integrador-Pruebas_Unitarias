const db = require('../config/database');

class PedidoDetalles {
  static async findAll() {
    const result = await db.query('SELECT * FROM PedidoDetalles');
    return result.rows;
  }

  static async findById(idPedido, idProducto) {
    const result = await db.query('SELECT * FROM PedidoDetalles WHERE idPedido = $1 AND idProducto = $2', [idPedido, idProducto]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO PedidoDetalles (idPedido, idProducto, cantidad) VALUES ($1, $2, $3) RETURNING *',
      [data.idPedido, data.idProducto, data.cantidad]
    );
    return result.rows[0];
  }

  static async update(idPedido, idProducto, data) {
    const result = await db.query(
      'UPDATE PedidoDetalles SET cantidad = $1 WHERE idPedido = $2 AND idProducto = $3 RETURNING *',
      [data.cantidad, idPedido, idProducto]
    );
    return result.rows[0];
  }

  static async delete(idPedido, idProducto) {
    const result = await db.query('DELETE FROM PedidoDetalles WHERE idPedido = $1 AND idProducto = $2 RETURNING *', [idPedido, idProducto]);
    return result.rows[0];
  }
}

module.exports = PedidoDetalles;



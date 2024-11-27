const db = require('../config/database');

class PedidoDetalles {
  static async findAll() {
    const result = await db.query('SELECT * FROM PedidoDetalles');
    return result.rows;
  }

  static async findById(idPedido, idProducto) {
    const result = await db.query(
      'SELECT * FROM PedidoDetalles WHERE idPedido = $1 AND idProducto = $2',
      [idPedido, idProducto]
    );
    return result.rows[0];
  }

  static async create(data) {
    const pedidoExists = await db.query('SELECT 1 FROM Pedidos WHERE idPedido = $1', [data.idPedido]);
    if (pedidoExists.rowCount === 0) {
      throw new Error(`El pedido con idPedido ${data.idPedido} no existe.`);
    }

    const productoExists = await db.query('SELECT precio, stock FROM Productos WHERE idProducto = $1', [data.idProducto]);
    if (productoExists.rowCount === 0) {
      throw new Error(`El producto con idProducto ${data.idProducto} no existe.`);
    }

    const { precio, stock } = productoExists.rows[0];
    if (data.cantidad > stock) {
      throw new Error(`Stock insuficiente (${stock} disponible, solicitado: ${data.cantidad}).`);
    }

    const detalleExists = await db.query(
      'SELECT 1 FROM PedidoDetalles WHERE idPedido = $1 AND idProducto = $2',
      [data.idPedido, data.idProducto]
    );
    if (detalleExists.rowCount > 0) {
      throw new Error(`El detalle con idPedido ${data.idPedido} y idProducto ${data.idProducto} ya existe.`);
    }

    const subtotal = precio * data.cantidad;
    const iva = subtotal * 0.16;

    const result = await db.query(
      'INSERT INTO PedidoDetalles (idPedido, idProducto, cantidad, subtotal, iva) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [data.idPedido, data.idProducto, data.cantidad, subtotal, iva]
    );

    await db.query('UPDATE Productos SET stock = stock - $1 WHERE idProducto = $2', [data.cantidad, data.idProducto]);

    return result.rows[0];
  }

  static async update(idPedido, idProducto, data) {
    const detalleExists = await db.query(
      'SELECT cantidad FROM PedidoDetalles WHERE idPedido = $1 AND idProducto = $2',
      [idPedido, idProducto]
    );
    if (detalleExists.rowCount === 0) {
      throw new Error(`El detalle con idPedido ${idPedido} y idProducto ${idProducto} no existe.`);
    }

    const productoExists = await db.query('SELECT precio FROM Productos WHERE idProducto = $1', [idProducto]);
    if (productoExists.rowCount === 0) {
      throw new Error(`El producto con idProducto ${idProducto} no existe.`);
    }

    const { precio } = productoExists.rows[0];
    const subtotal = precio * data.cantidad;
    const iva = subtotal * 0.16;

    const result = await db.query(
      'UPDATE PedidoDetalles SET cantidad = $1, subtotal = $2, iva = $3 WHERE idPedido = $4 AND idProducto = $5 RETURNING *',
      [data.cantidad, subtotal, iva, idPedido, idProducto]
    );

    return result.rows[0];
  }

  static async delete(idPedido, idProducto) {
    const detalleExists = await db.query(
      'SELECT cantidad FROM PedidoDetalles WHERE idPedido = $1 AND idProducto = $2',
      [idPedido, idProducto]
    );
    if (detalleExists.rowCount === 0) {
      throw new Error(`El detalle con idPedido ${idPedido} y idProducto ${idProducto} no existe.`);
    }

    const cantidad = detalleExists.rows[0].cantidad;

    const result = await db.query(
      'DELETE FROM PedidoDetalles WHERE idPedido = $1 AND idProducto = $2 RETURNING *',
      [idPedido, idProducto]
    );

    await db.query('UPDATE Productos SET stock = stock + $1 WHERE idProducto = $2', [cantidad, idProducto]);

    return result.rows[0];
  }
}

module.exports = PedidoDetalles;

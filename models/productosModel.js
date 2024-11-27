const db = require('../config/database');

class Productos {
  static async findAll() {
    const result = await db.query('SELECT * FROM Productos');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM Productos WHERE idProducto = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO Productos (nombre, descripcion, precio, stock, idcategoria) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [data.nombre, data.descripcion, data.precio, data.stock, data.idcategoria] 
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      'UPDATE Productos SET nombre = $1, descripcion = $2, precio = $3, stock = $4, idcategoria = $5 WHERE idProducto = $6 RETURNING *',
      [data.nombre, data.descripcion, data.precio, data.stock, data.idcategoria, id] 
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM Productos WHERE idProducto = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Productos;




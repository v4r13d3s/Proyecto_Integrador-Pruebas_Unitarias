const db = require('../config/database');

class Usuarios {
  static async findAll() {
    const result = await db.query('SELECT * FROM Usuarios');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM Usuarios WHERE idUsuario = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO Usuarios (nombre, correo, password, idRol) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.nombre, data.correo, data.password, data.idRol] 
    );
    return result.rows[0]; 
  }

  static async update(id, data) {
    const result = await db.query(
      'UPDATE Usuarios SET nombre = $1, correo = $2, password = $3, idRol = $4 WHERE idUsuario = $5 RETURNING *',
      [data.nombre, data.correo, data.password, data.idRol, id] 
    );
    return result.rows[0]; 
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM Usuarios WHERE idUsuario = $1 RETURNING *', [id]);
    return result.rows[0]; 
  }
}

module.exports = Usuarios;

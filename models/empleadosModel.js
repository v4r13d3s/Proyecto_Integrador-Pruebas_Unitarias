const db = require('../config/database');

class Empleados {
  static async findAll() {
    const result = await db.query('SELECT * FROM empleados');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM empleados WHERE idEmpleado = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      'INSERT INTO empleados (nombre, appaterno, apmaterno, fechanacimiento, curp, idusuario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [data.nombre, data.appaterno, data.apmaterno, data.fechanacimiento, data.curp, data.idusuario]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      'UPDATE empleados SET nombre = $1, appaterno = $2, apmaterno = $3, fechanacimiento = $4, curp = $5, idusuario = $6 WHERE idEmpleado = $7 RETURNING *',
      [data.nombre, data.appaterno, data.apmaterno, data.fechanacimiento, data.curp, data.idusuario, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM empleados WHERE idEmpleado = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Empleados;


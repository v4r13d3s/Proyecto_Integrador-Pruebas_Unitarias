const request = require('supertest');
const app = require('../src/ventas'); // Asumiendo que el archivo ventas.js está en src/
const db = require('../config/database');
const assert = require('assert');

require('./testSetup'); // Configuración inicial de pruebas

describe('Ventas API Endpoints', () => {
  before(async () => {
    // Limpieza y reinicio de las tablas
    await db.query('TRUNCATE TABLE Ventas RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE Empleados RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE Usuarios RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE Roles RESTART IDENTITY CASCADE');

    // Insertar roles
    await db.query(`
      INSERT INTO Roles (tipo)
      VALUES ('Administrador'), ('Vendedor');
    `);

    // Insertar usuarios
    await db.query(`
      INSERT INTO Usuarios (nombre, correo, password, idRol)
      VALUES
      ('Eliezer Cerecedo', 'eliezercerecedo82@gmail.com', 'Bocchi17', 1),
      ('Juan Pablo', 'juanpablo@gmail.com', 'pablitin18', 2);
    `);

    // Insertar empleados
    await db.query(`
      INSERT INTO Empleados (nombre, apPaterno, apMaterno, fechaNacimiento, curp, idUsuario)
      VALUES
      ('Eliezer Isai', 'Cerecedo', 'Florencia', '2002-11-12', 'ABC123456XYZ789012', 1),
      ('Juan', 'Perez', 'Lopez', '1985-07-20', 'DEF123456XYZ789012', 2);
    `);

    // Insertar ventas (asegúrate de que idEmpleado corresponda a un id válido)
    await db.query(`
      INSERT INTO Ventas (fechaVenta, monto, idEmpleado)
      VALUES (NOW(), 1000.50, 1), (NOW(), 500.75, 2);
    `);
  });

  after(async () => {
    // Limpieza después de las pruebas
    await db.query('TRUNCATE TABLE Ventas RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE Empleados RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE Usuarios RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE Roles RESTART IDENTITY CASCADE');
  });

  it('GET /api/ventas debe retornar todas las ventas', async () => {
    const res = await request(app).get('/api/ventas');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 2); // Verifica que hay dos ventas
  });

  it('GET /api/ventas/:folio debe retornar una venta por folio', async () => {
    const res = await request(app).get('/api/ventas/1');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.folio, 1);
    assert.strictEqual(res.body.monto, 1000.50);
  });

  it('POST /api/ventas debe crear una nueva venta', async () => {
    const newVenta = { monto: 700.25, idempleado: 2 }; // asegurarse de que los datos sean correctos
    const res = await request(app).post('/api/ventas').send(newVenta);
    assert.strictEqual(res.status, 201); // Espera 201: Created
    assert.strictEqual(res.body.monto, 700.25); // Verifica el monto
    assert.strictEqual(res.body.idempleado, 2); // Verifica el id del empleado
  });
  
  it('POST /api/ventas debe fallar si falta el campo monto', async () => {
    const invalidVenta = { idEmpleado: 2 }; // Monto faltante
    const res = await request(app).post('/api/ventas').send(invalidVenta);
    assert.strictEqual(res.status, 400); // Bad Request
  });

  it('PUT /api/ventas/:folio debe actualizar una venta', async () => {
    const updatedVenta = { monto: 1200.75, idempleado: 1 }; // asegurarse de que los datos sean correctos
    const res = await request(app).put('/api/ventas/1').send(updatedVenta);
    assert.strictEqual(res.status, 200); // Espera 200: OK
    assert.strictEqual(res.body.monto, 1200.75); // Verifica el monto actualizado
    assert.strictEqual(res.body.idempleado, 1); // Verifica el id del empleado
  });
  
  it('DELETE /api/ventas/:folio debe eliminar una venta', async () => {
    const res = await request(app).delete('/api/ventas/1');
    assert.strictEqual(res.status, 204); // No Content

    // Verificar que la venta fue eliminada
    const getRes = await request(app).get('/api/ventas/1');
    assert.strictEqual(getRes.status, 404); // Venta no encontrada
  });

  it('GET /api/ventas/:folio debe retornar 404 para una venta inexistente', async () => {
    const res = await request(app).get('/api/ventas/9999'); // Folio inexistente
    assert.strictEqual(res.status, 404); // No se encuentra la venta
  });
});

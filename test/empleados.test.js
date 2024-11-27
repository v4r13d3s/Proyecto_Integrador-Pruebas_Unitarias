const request = require('supertest');
const app = require('../src/empleados.js'); // Cambia según el nombre del archivo principal de tu app
const db = require('../config/database');
const assert = require('assert');

// Configuración inicial para las pruebas
require('./testSetup'); // Archivo de configuración para limpiar datos entre tests

describe('Empleados API Endpoints', () => {
  before(async () => {
    // Limpiar la tabla empleados y agregar datos iniciales
    await db.query('TRUNCATE TABLE empleados RESTART IDENTITY CASCADE');
    await db.query(
      "INSERT INTO empleados (nombre, appaterno, apmaterno, fechanacimiento, curp, idusuario) VALUES ('Juan', 'Pérez', 'López', '1990-01-01', 'CURP123456HDFRLL01', 1)"
    );
  });

  after(async () => {
    // Limpiar la tabla después de las pruebas
    await db.query('TRUNCATE TABLE empleados RESTART IDENTITY CASCADE');
  });

  it('GET /api/empleados debe retornar todos los empleados', async () => {
    const res = await request(app).get('/api/empleados');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 1);
  });

  it('GET /api/empleados/:id debe retornar un empleado por ID', async () => {
    const res = await request(app).get('/api/empleados/1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Juan');
  });

  it('POST /api/empleados debe crear un nuevo empleado', async () => {
    const newEmpleado = {
      nombre: 'Ana',
      appaterno: 'Martínez',
      apmaterno: 'García',
      fechanacimiento: '1985-05-15',
      curp: 'CURP456789GDFANA02',
      idusuario: 2
    };
    const res = await request(app).post('/api/empleados').send(newEmpleado);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Ana');

    // Verificar que se agregó correctamente
    const allEmpleados = await request(app).get('/api/empleados');
    assert.strictEqual(allEmpleados.body.length, 2);
  });

  it('PUT /api/empleados/:id debe actualizar un empleado', async () => {
    const updatedEmpleado = {
      nombre: 'Carlos',
      appaterno: 'Hernández',
      apmaterno: 'Ruiz',
      fechanacimiento: '1980-10-10',
      curp: 'CURP654321CDFCRL03',
      idusuario: 3
    };
    const res = await request(app).put('/api/empleados/1').send(updatedEmpleado);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Carlos');
  });

  it('DELETE /api/empleados/:id debe eliminar un empleado', async () => {
    const res = await request(app).delete('/api/empleados/1');
    assert.strictEqual(res.status, 204);

    // Verificar que el empleado fue eliminado
    const allEmpleados = await request(app).get('/api/empleados');
    assert.strictEqual(allEmpleados.body.length, 1);
  });

  it('GET /api/empleados/:id debe retornar 404 para un empleado inexistente', async () => {
    const res = await request(app).get('/api/empleados/9999');
    assert.strictEqual(res.status, 404);
  });
});

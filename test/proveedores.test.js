const request = require('supertest');
const app = require('../src/proveedores.js'); // Ruta al archivo principal de la app
const db = require('../config/database');
const assert = require('assert');

// Configuración inicial para las pruebas
require('./testSetup'); // Configuración global para limpiar datos entre pruebas

describe('Proveedores API Endpoints', () => {
  before(async () => {
    // Limpiar la tabla y agregar datos iniciales
    await db.query('TRUNCATE TABLE Proveedores RESTART IDENTITY CASCADE');
    await db.query("INSERT INTO Proveedores (nombre, direccion, rfc, telefono) VALUES ('Proveedor A', 'Calle 1, Ciudad', 'RFC12345A', '5555555555')");
  });

  after(async () => {
    // Limpiar la tabla después de las pruebas
    await db.query('TRUNCATE TABLE Proveedores RESTART IDENTITY CASCADE');
  });

  it('GET /api/proveedores debe retornar todos los proveedores', async () => {
    const res = await request(app).get('/api/proveedores');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 1);
  });

  it('GET /api/proveedores/:id debe retornar un proveedor por ID', async () => {
    const res = await request(app).get('/api/proveedores/1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Proveedor A');
  });

  it('POST /api/proveedores debe crear un nuevo proveedor', async () => {
    const newProveedor = {
      nombre: 'Proveedor B',
      direccion: 'Calle 2, Ciudad',
      rfc: 'RFC54321B',
      telefono: '6666666666'
    };
    const res = await request(app).post('/api/proveedores').send(newProveedor);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Proveedor B');

    // Verificar que se agregó correctamente
    const allProveedores = await request(app).get('/api/proveedores');
    assert.strictEqual(allProveedores.body.length, 2);
  });

  it('PUT /api/proveedores/:id debe actualizar un proveedor', async () => {
    const updatedProveedor = {
      nombre: 'Proveedor Actualizado',
      direccion: 'Calle 3, Ciudad',
      rfc: 'RFC56789C',
      telefono: '7777777777'
    };
    const res = await request(app).put('/api/proveedores/1').send(updatedProveedor);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Proveedor Actualizado');
  });

  it('DELETE /api/proveedores/:id debe eliminar un proveedor', async () => {
    const res = await request(app).delete('/api/proveedores/1');
    assert.strictEqual(res.status, 204);

    // Verificar que el proveedor fue eliminado
    const allProveedores = await request(app).get('/api/proveedores');
    assert.strictEqual(allProveedores.body.length, 1);
  });

  it('GET /api/proveedores/:id debe retornar 404 para un proveedor inexistente', async () => {
    const res = await request(app).get('/api/proveedores/9999');
    assert.strictEqual(res.status, 404);
  });
});

const request = require('supertest');
const app = require('../src/roles.js'); // Ruta al archivo principal de la app
const db = require('../config/database');
const assert = require('assert');

// Configuración inicial para las pruebas
require('./testSetup'); // Configuración global para limpiar datos entre pruebas

describe('Roles API Endpoints', () => {
  before(async () => {
    // Limpiar la tabla y agregar datos iniciales
    await db.query('TRUNCATE TABLE Roles RESTART IDENTITY CASCADE');
    await db.query("INSERT INTO Roles (tipo) VALUES ('Admin')");
  });

  after(async () => {
    // Limpiar la tabla después de las pruebas
    await db.query('TRUNCATE TABLE Roles RESTART IDENTITY CASCADE');
  });

  it('GET /api/roles debe retornar todos los roles', async () => {
    const res = await request(app).get('/api/roles');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 1);
  });

  it('GET /api/roles/:id debe retornar un rol por ID', async () => {
    const res = await request(app).get('/api/roles/1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('tipo'));
    assert.strictEqual(res.body.tipo, 'Admin');
  });

  it('POST /api/roles debe crear un nuevo rol', async () => {
    const newRol = { tipo: 'User' };
    const res = await request(app).post('/api/roles').send(newRol);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.hasOwnProperty('tipo'));
    assert.strictEqual(res.body.tipo, 'User');

    // Verificar que se agregó correctamente
    const allRoles = await request(app).get('/api/roles');
    assert.strictEqual(allRoles.body.length, 2);
  });

  it('PUT /api/roles/:id debe actualizar un rol', async () => {
    const updatedRol = { tipo: 'SuperAdmin' };
    const res = await request(app).put('/api/roles/1').send(updatedRol);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('tipo'));
    assert.strictEqual(res.body.tipo, 'SuperAdmin');
  });

  it('DELETE /api/roles/:id debe eliminar un rol', async () => {
    const res = await request(app).delete('/api/roles/1');
    assert.strictEqual(res.status, 204);

    // Verificar que el rol fue eliminado
    const allRoles = await request(app).get('/api/roles');
    assert.strictEqual(allRoles.body.length, 1);
  });

  it('GET /api/roles/:id debe retornar 404 para un rol inexistente', async () => {
    const res = await request(app).get('/api/roles/9999');
    assert.strictEqual(res.status, 404);
  });
});

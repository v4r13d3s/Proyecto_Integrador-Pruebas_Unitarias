const request = require('supertest');
const app = require('../src/roles.js');
const db = require('../config/database');
const assert = require('assert');

require('./testSetup'); // Configuración inicial de pruebas

describe('Roles API Endpoints', () => {
  before(async () => {
    // Reiniciar tabla de roles
    await db.query('TRUNCATE TABLE Roles RESTART IDENTITY CASCADE');

    // Insertar datos iniciales desde la base de datos proporcionada
    await db.query(`
      INSERT INTO Roles (tipo) 
      VALUES 
      ('Administrador'), 
      ('Vendedor'), 
      ('Cliente'), 
      ('Gerente'), 
      ('Soporte Técnico');
    `);
  });

  after(async () => {
    // Limpieza después de las pruebas
    await db.query('TRUNCATE TABLE Roles RESTART IDENTITY CASCADE');
  });

  it('GET /api/roles debe retornar todos los roles', async () => {
    const res = await request(app).get('/api/roles');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 5); // Verifica que hay 5 roles en la base de datos
  });

  it('GET /api/roles/:id debe retornar un rol por ID', async () => {
    const res = await request(app).get('/api/roles/1'); // Rol con id 1 debería ser 'Administrador'
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.tipo, 'Administrador');
  });

  it('POST /api/roles debe crear un nuevo rol', async () => {
    const newRol = { tipo: 'Moderador' };
    const res = await request(app).post('/api/roles').send(newRol);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.tipo, 'Moderador');
  });

  it('POST /api/roles debe fallar si falta el campo tipo', async () => {
    const invalidRol = {}; // Aquí falta el campo "tipo"
    const res = await request(app).post('/api/roles').send(invalidRol);
    assert.strictEqual(res.status, 400); // Espera un error 400
    assert.strictEqual(res.body.message, 'El campo "tipo" es obligatorio.'); // Verifica el mensaje de error
  });
  

  it('PUT /api/roles/:id debe actualizar un rol', async () => {
    const updatedRol = { tipo: 'SuperAdmin' };
    const res = await request(app).put('/api/roles/1').send(updatedRol); // Actualizar rol 'Administrador'
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.tipo, 'SuperAdmin');
  });

  it('DELETE /api/roles/:id debe eliminar un rol', async () => {
    const res = await request(app).delete('/api/roles/1'); // Eliminar rol 'Administrador'
    assert.strictEqual(res.status, 204); // No Content

    // Verificar que el rol fue eliminado
    const getRes = await request(app).get('/api/roles/1');
    assert.strictEqual(getRes.status, 404);
  });

  it('GET /api/roles/:id debe retornar 404 para un rol inexistente', async () => {
    const res = await request(app).get('/api/roles/9999'); // ID que no existe
    assert.strictEqual(res.status, 404);
  });
});

const request = require('supertest');
const app = require('../src/usuarios.js'); // Ruta al archivo principal de la app
const db = require('../config/database');
const assert = require('assert');

// Configuración inicial para las pruebas
require('./testSetup'); // Configuración global para limpiar datos entre pruebas

describe('Usuarios API Endpoints', () => {
  before(async () => {
    // Limpiar la tabla y agregar datos iniciales
    await db.query('TRUNCATE TABLE Usuarios RESTART IDENTITY CASCADE');
    await db.query("INSERT INTO Usuarios (nombre, correo, password, idRol) VALUES ('Juan Pérez', 'juan@gmail.com', '12345', 1)");
  });

  after(async () => {
    // Limpiar la tabla después de las pruebas
    await db.query('TRUNCATE TABLE Usuarios RESTART IDENTITY CASCADE');
  });

  it('GET /api/usuarios debe retornar todos los usuarios', async () => {
    const res = await request(app).get('/api/usuarios');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 1);
  });

  it('GET /api/usuarios/:id debe retornar un usuario por ID', async () => {
    const res = await request(app).get('/api/usuarios/1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Juan Pérez');
  });

  it('POST /api/usuarios debe crear un nuevo usuario', async () => {
    const newUsuario = {
      nombre: 'Ana García',
      correo: 'ana@gmail.com',
      password: '54321',
      idRol: 2
    };
    const res = await request(app).post('/api/usuarios').send(newUsuario);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Ana García');

    // Verificar que se agregó correctamente
    const allUsuarios = await request(app).get('/api/usuarios');
    assert.strictEqual(allUsuarios.body.length, 2);
  });

  it('PUT /api/usuarios/:id debe actualizar un usuario', async () => {
    const updatedUsuario = {
      nombre: 'Juan Pérez Actualizado',
      correo: 'juan.actualizado@gmail.com',
      password: '67890',
      idRol: 1
    };
    const res = await request(app).put('/api/usuarios/1').send(updatedUsuario);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Juan Pérez Actualizado');
  });

  it('DELETE /api/usuarios/:id debe eliminar un usuario', async () => {
    const res = await request(app).delete('/api/usuarios/1');
    assert.strictEqual(res.status, 204);

    // Verificar que el usuario fue eliminado
    const allUsuarios = await request(app).get('/api/usuarios');
    assert.strictEqual(allUsuarios.body.length, 1);
  });

  it('GET /api/usuarios/:id debe retornar 404 para un usuario inexistente', async () => {
    const res = await request(app).get('/api/usuarios/9999');
    assert.strictEqual(res.status, 404);
  });
});

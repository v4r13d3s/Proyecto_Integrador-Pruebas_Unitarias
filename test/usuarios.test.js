const request = require('supertest');
const app = require('../src/usuarios.js'); // Ruta al archivo principal de la app
const db = require('../config/database');
const assert = require('assert');

// Configuración inicial para las pruebas
require('./testSetup'); // Configuración global para limpiar datos entre pruebas

describe('Usuarios API Endpoints', () => {
  before(async () => {
    // Limpiar las tablas y agregar datos iniciales
    await db.query('TRUNCATE TABLE Usuarios RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE Roles RESTART IDENTITY CASCADE');

    // Insertar roles
    await db.query(`
      INSERT INTO Roles (tipo)
      VALUES ('Administrador'), ('Vendedor'), ('Cliente');
    `);

    // Insertar usuarios
    await db.query(`
      INSERT INTO Usuarios (nombre, correo, password, idRol)
      VALUES 
      ('Juan Pérez', 'juan@gmail.com', '123456', 1),
      ('Ana García', 'ana@gmail.com', 'abcdef', 2);
    `);
  });

  after(async () => {
    // Limpiar las tablas después de las pruebas
    await db.query('TRUNCATE TABLE Usuarios RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE Roles RESTART IDENTITY CASCADE');
  });

  it('GET /api/usuarios debe retornar todos los usuarios', async () => {
    const res = await request(app).get('/api/usuarios');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 2);
    assert.strictEqual(res.body[0].nombre, 'Juan Pérez');
  });

  it('GET /api/usuarios/:id debe retornar un usuario por ID', async () => {
    const res = await request(app).get('/api/usuarios/1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Juan Pérez');
  });

  it('POST /api/usuarios debe crear un nuevo usuario', async () => {
    const newUsuario = {
      nombre: 'Oscar López',
      correo: 'oscar@gmail.com',
      password: '12345678',
      idRol: 3,
    };
    const res = await request(app).post('/api/usuarios').send(newUsuario);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Oscar López');

    // Verificar que se agregó correctamente
    const allUsuarios = await request(app).get('/api/usuarios');
    assert.strictEqual(allUsuarios.body.length, 3);
  });

  it('POST /api/usuarios debe fallar con datos inválidos', async () => {
    const invalidUsuario = {
      nombre: '', // Nombre vacío
      correo: 'oscar.com', // Correo inválido
      password: '123', // Contraseña corta
      idRol: 'admin', // idRol inválido
    };
    const res = await request(app).post('/api/usuarios').send(invalidUsuario);
    assert.strictEqual(res.status, 400);
    assert.ok(Array.isArray(res.body.errores));
    assert.ok(res.body.errores.length > 0);
  });

  it('PUT /api/usuarios/:id debe actualizar un usuario existente', async () => {
    const updatedUsuario = {
      nombre: 'Juan Pérez Actualizado',
      correo: 'juan.actualizado@gmail.com',
      password: '654321',
      idRol: 2,
    };
    const res = await request(app).put('/api/usuarios/1').send(updatedUsuario);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Juan Pérez Actualizado');
  });

  it('PUT /api/usuarios/:id debe fallar con datos inválidos', async () => {
    const invalidUsuario = {
      nombre: 'A', // Nombre demasiado corto
      correo: 'invalid.com', // Correo inválido
      password: '123', // Contraseña corta
      idRol: 'rol', // idRol inválido
    };
    const res = await request(app).put('/api/usuarios/1').send(invalidUsuario);
    assert.strictEqual(res.status, 400);
    assert.ok(Array.isArray(res.body.errores));
    assert.ok(res.body.errores.length > 0);
  });

  it('DELETE /api/usuarios/:id debe eliminar un usuario existente', async () => {
    const res = await request(app).delete('/api/usuarios/1');
    assert.strictEqual(res.status, 204);

    // Verificar que el usuario fue eliminado
    const getRes = await request(app).get('/api/usuarios/1');
    assert.strictEqual(getRes.status, 404);
  });

  it('GET /api/usuarios/:id debe retornar 404 para un usuario inexistente', async () => {
    const res = await request(app).get('/api/usuarios/999');
    assert.strictEqual(res.status, 404);
  });
});

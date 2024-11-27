const request = require('supertest');
const app = require('../src/empleados.js'); // Asegúrate de que el archivo exporte la app de Express
const db = require('../config/database');
const assert = require('assert');

require('./testSetup');

describe('Bienvenida', () => {
  it('Bienvenido a los test de la API MS', () => {
    console.log('***********************************');
    console.log('* Bienvenido a los test de la API MS *');
    console.log('***********************************');
  });
});

describe('Empleados API Endpoints', () => {
  before(async () => {
    // Reiniciar tablas relacionadas y configurar datos iniciales
    await db.query('TRUNCATE TABLE empleados RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE roles RESTART IDENTITY CASCADE');

    // Insertar roles
    await db.query(`
      INSERT INTO roles (tipo) 
      VALUES ('Administrador'), ('Vendedor'), ('Cliente'), ('Gerente'), ('Soporte Técnico');
    `);

    // Insertar usuarios
    await db.query(`
      INSERT INTO usuarios (nombre, correo, password, idRol)
      VALUES 
        ('Eliezer Cerecedo', 'eliezercerecedo82@gmail.com', 'Bocchi17', 1),
        ('Juan Pablo', 'juanpablo@gmail.com', 'pablitin18', 2);
    `);

    // Insertar empleados
    await db.query(`
      INSERT INTO empleados (nombre, appaterno, apmaterno, fechanacimiento, curp, idusuario)
      VALUES 
        ('Eliezer Isai', 'Cerecedo', 'Florencia', '2002-11-12', 'ABC123456XYZ789012', 1),
        ('Juan', 'Perez', 'Lopez', '1985-07-20', 'DEF123456XYZ789012', 2);
    `);
  });

  after(async () => {
    await db.query('TRUNCATE TABLE empleados RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE roles RESTART IDENTITY CASCADE');
  });

  it('GET /api/empleados debe retornar todos los empleados', async () => {
    const res = await request(app).get('/api/empleados');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 2);
    assert.strictEqual(res.body[0].nombre, 'Eliezer Isai');
  });

  it('GET /api/empleados/:id debe retornar un empleado por ID', async () => {
    const res = await request(app).get('/api/empleados/1');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.nombre, 'Eliezer Isai');
  });

  it('POST /api/empleados debe crear un nuevo empleado con datos válidos', async () => {
    const newEmpleado = {
      nombre: 'Oscar',
      appaterno: 'Martinez',
      apmaterno: 'Gomez',
      fechanacimiento: '1990-04-15',
      curp: 'OSMG900415HDFRZS02', // CURP con formato válido
      idusuario: 1,
    };
    const res = await request(app).post('/api/empleados').send(newEmpleado);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.nombre, 'Oscar');
  });

  it('POST /api/empleados debe fallar con datos inválidos', async () => {
    const invalidEmpleado = {
      nombre: 'Os', // Nombre demasiado corto
      appaterno: '', // Apellido paterno vacío
      apmaterno: 'ApellidoMuyLargoQueExcedeElLimite', // Apellido materno demasiado largo
      fechanacimiento: '2025-04-15', // Fecha futura inválida
      curp: 'CURPINVALIDO', // CURP con formato incorrecto
      idusuario: 1,
    };
    const res = await request(app).post('/api/empleados').send(invalidEmpleado);
    assert.strictEqual(res.status, 400);
    assert.strictEqual(Array.isArray(res.body.errores), true);
    assert.ok(res.body.errores.length > 0);
  });

  it('PUT /api/empleados/:id debe actualizar un empleado con datos válidos', async () => {
    const updatedEmpleado = {
      nombre: 'Eliezer Actualizado',
      appaterno: 'Cerecedo',
      apmaterno: 'Florencia',
      fechanacimiento: '2002-11-12',
      curp: 'ELCF021112HDFRZS04', // CURP con formato válido
      idusuario: 1,
    };
    const res = await request(app).put('/api/empleados/1').send(updatedEmpleado);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.nombre, 'Eliezer Actualizado');
  });

  it('DELETE /api/empleados/:id debe eliminar un empleado', async () => {
    const res = await request(app).delete('/api/empleados/1');
    assert.strictEqual(res.status, 204);

    // Verificar que el empleado fue eliminado
    const getRes = await request(app).get('/api/empleados/1');
    assert.strictEqual(getRes.status, 404);
  });

  it('GET /api/empleados/:id debe retornar 404 para un empleado inexistente', async () => {
    const res = await request(app).get('/api/empleados/9999');
    assert.strictEqual(res.status, 404);
  });
});

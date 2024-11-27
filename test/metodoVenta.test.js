const request = require('supertest');
const app = require('../src/metodosVenta.js'); // Cambia según el archivo principal de tu app
const db = require('../config/database');
const assert = require('assert');

// Configuración inicial para las pruebas
require('./testSetup'); // Archivo de configuración para limpiar datos entre tests

describe('Métodos de Venta API Endpoints', () => {
  before(async () => {
    // Limpiar la tabla y agregar datos iniciales
    await db.query('TRUNCATE TABLE MetodoVenta RESTART IDENTITY CASCADE');
    await db.query(
      "INSERT INTO MetodoVenta (idTipoPago, descripcion, comision, fecha_creacion, activo) VALUES (1, 'Tarjeta de Crédito', 2.5, NOW(), true)"
    );
  });

  after(async () => {
    // Limpiar la tabla después de las pruebas
    await db.query('TRUNCATE TABLE MetodoVenta RESTART IDENTITY CASCADE');
  });

  it('GET /api/metodoVenta debe retornar todos los métodos de venta', async () => {
    const res = await request(app).get('/api/metodoVenta');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 1);
  });

  it('GET /api/metodoVenta/:id debe retornar un método de venta por ID', async () => {
    const res = await request(app).get('/api/metodoVenta/1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('descripcion'));
    assert.strictEqual(res.body.descripcion, 'Tarjeta de Crédito');
  });

  it('POST /api/metodoVenta debe crear un nuevo método de venta', async () => {
    const newMetodoVenta = {
      idTipoPago: 2,
      descripcion: 'PayPal',
      comision: 3.0,
      activo: true
    };
    const res = await request(app).post('/api/metodoVenta').send(newMetodoVenta);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.hasOwnProperty('descripcion'));
    assert.strictEqual(res.body.descripcion, 'PayPal');

    // Verificar que se agregó correctamente
    const allMetodoVenta = await request(app).get('/api/metodoVenta');
    assert.strictEqual(allMetodoVenta.body.length, 2);
  });

  it('PUT /api/metodoVenta/:id debe actualizar un método de venta', async () => {
    const updatedMetodoVenta = {
      idTipoPago: 3,
      descripcion: 'Pago en Efectivo',
      comision: 0,
      activo: false
    };
    const res = await request(app).put('/api/metodoVenta/1').send(updatedMetodoVenta);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('descripcion'));
    assert.strictEqual(res.body.descripcion, 'Pago en Efectivo');
  });

  it('DELETE /api/metodoVenta/:id debe eliminar un método de venta', async () => {
    const res = await request(app).delete('/api/metodoVenta/1');
    assert.strictEqual(res.status, 204);

    // Verificar que el método de venta fue eliminado
    const allMetodoVenta = await request(app).get('/api/metodoVenta');
    assert.strictEqual(allMetodoVenta.body.length, 1);
  });

  it('GET /api/metodoVenta/:id debe retornar 404 para un método de venta inexistente', async () => {
    const res = await request(app).get('/api/metodoVenta/9999');
    assert.strictEqual(res.status, 404);
  });
});

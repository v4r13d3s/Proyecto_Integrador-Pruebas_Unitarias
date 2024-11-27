const request = require('supertest');
const app = require('../src/tipoPago.js'); // Ruta al archivo principal de la app
const db = require('../config/database');
const assert = require('assert');

// Configuración inicial para las pruebas
require('./testSetup'); // Configuración global para limpiar datos entre pruebas

describe('TipoPago API Endpoints', () => {
  before(async () => {
    // Limpiar la tabla y agregar datos iniciales
    await db.query('TRUNCATE TABLE TipoPago RESTART IDENTITY CASCADE');
    await db.query("INSERT INTO TipoPago (descripcion, activo) VALUES ('Tarjeta de Crédito', true)");
  });

  after(async () => {
    // Limpiar la tabla después de las pruebas
    await db.query('TRUNCATE TABLE TipoPago RESTART IDENTITY CASCADE');
  });

  it('GET /api/tipoPago debe retornar todos los tipos de pago', async () => {
    const res = await request(app).get('/api/tipoPago');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 1);
  });

  it('GET /api/tipoPago/:id debe retornar un tipo de pago por ID', async () => {
    const res = await request(app).get('/api/tipoPago/1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('descripcion'));
    assert.strictEqual(res.body.descripcion, 'Tarjeta de Crédito');
  });

  it('POST /api/tipoPago debe crear un nuevo tipo de pago', async () => {
    const newTipoPago = { descripcion: 'PayPal', activo: true };
    const res = await request(app).post('/api/tipoPago').send(newTipoPago);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.hasOwnProperty('descripcion'));
    assert.strictEqual(res.body.descripcion, 'PayPal');

    // Verificar que se agregó correctamente
    const allTiposPago = await request(app).get('/api/tipoPago');
    assert.strictEqual(allTiposPago.body.length, 2);
  });

  it('PUT /api/tipoPago/:id debe actualizar un tipo de pago', async () => {
    const updatedTipoPago = { descripcion: 'Pago en Efectivo', activo: false };
    const res = await request(app).put('/api/tipoPago/1').send(updatedTipoPago);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('descripcion'));
    assert.strictEqual(res.body.descripcion, 'Pago en Efectivo');
  });

  it('DELETE /api/tipoPago/:id debe eliminar un tipo de pago', async () => {
    const res = await request(app).delete('/api/tipoPago/1');
    assert.strictEqual(res.status, 204);

    // Verificar que el tipo de pago fue eliminado
    const allTiposPago = await request(app).get('/api/tipoPago');
    assert.strictEqual(allTiposPago.body.length, 1);
  });

  it('GET /api/tipoPago/:id debe retornar 404 para un tipo de pago inexistente', async () => {
    const res = await request(app).get('/api/tipoPago/9999');
    assert.strictEqual(res.status, 404);
  });
});

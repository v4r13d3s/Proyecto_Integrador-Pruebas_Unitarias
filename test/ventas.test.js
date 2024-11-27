const request = require('supertest');
const app = require('../src/ventas.js'); // Ruta al archivo principal de la app
const db = require('../config/database');
const assert = require('assert');

// Configuración inicial para las pruebas
require('./testSetup'); // Configuración global para limpiar datos entre pruebas

describe('Ventas API Endpoints', () => {
  before(async () => {
    // Limpiar la tabla y agregar datos iniciales
    await db.query('TRUNCATE TABLE Ventas RESTART IDENTITY CASCADE');
    await db.query("INSERT INTO Ventas (monto, idempleado, fechaVenta) VALUES (500, 1, NOW())");
  });

  after(async () => {
    // Limpiar la tabla después de las pruebas
    await db.query('TRUNCATE TABLE Ventas RESTART IDENTITY CASCADE');
  });

  it('GET /api/ventas debe retornar todas las ventas', async () => {
    const res = await request(app).get('/api/ventas');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 1);
  });

  it('GET /api/ventas/:folio debe retornar una venta por folio', async () => {
    const res = await request(app).get('/api/ventas/1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('monto'));
    assert.strictEqual(res.body.monto, 500);
  });

  it('POST /api/ventas debe crear una nueva venta', async () => {
    const newVenta = { monto: 750, idempleado: 2 };
    const res = await request(app).post('/api/ventas').send(newVenta);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.hasOwnProperty('monto'));
    assert.strictEqual(res.body.monto, 750);

    // Verificar que se agregó correctamente
    const allVentas = await request(app).get('/api/ventas');
    assert.strictEqual(allVentas.body.length, 2);
  });

  it('PUT /api/ventas/:folio debe actualizar una venta', async () => {
    const updatedVenta = { monto: 1000, idempleado: 1 };
    const res = await request(app).put('/api/ventas/1').send(updatedVenta);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('monto'));
    assert.strictEqual(res.body.monto, 1000);
  });

  it('DELETE /api/ventas/:folio debe eliminar una venta', async () => {
    const res = await request(app).delete('/api/ventas/1');
    assert.strictEqual(res.status, 204);

    // Verificar que la venta fue eliminada
    const allVentas = await request(app).get('/api/ventas');
    assert.strictEqual(allVentas.body.length, 1);
  });

  it('GET /api/ventas/:folio debe retornar 404 para una venta inexistente', async () => {
    const res = await request(app).get('/api/ventas/9999');
    assert.strictEqual(res.status, 404);
  });
});

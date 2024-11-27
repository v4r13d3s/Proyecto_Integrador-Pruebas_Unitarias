const request = require('supertest');
const app = require('../src/pedidos.js'); // Ruta al archivo principal de la app
const db = require('../config/database');
const assert = require('assert');

// Configuración inicial para las pruebas
require('./testSetup'); // Configuración global para limpiar datos entre pruebas

describe('Pedidos API Endpoints', () => {
  before(async () => {
    // Limpiar la tabla y agregar datos iniciales
    await db.query('TRUNCATE TABLE Pedidos RESTART IDENTITY CASCADE');
    await db.query("INSERT INTO Pedidos (total, estado, fechaPedido, idMetodoV, idProveedor) VALUES (1000, 'Pendiente', NOW(), 1, 1)");
  });

  after(async () => {
    // Limpiar la tabla después de las pruebas
    await db.query('TRUNCATE TABLE Pedidos RESTART IDENTITY CASCADE');
  });

  it('GET /api/pedidos debe retornar todos los pedidos', async () => {
    const res = await request(app).get('/api/pedidos');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 1);
  });

  it('GET /api/pedidos/:id debe retornar un pedido por ID', async () => {
    const res = await request(app).get('/api/pedidos/1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('total'));
    assert.strictEqual(res.body.total, 1000);
  });

  it('POST /api/pedidos debe crear un nuevo pedido', async () => {
    const newPedido = {
      total: 500,
      estado: 'En Proceso',
      idMetodoV: 2,
      idProveedor: 3
    };
    const res = await request(app).post('/api/pedidos').send(newPedido);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.hasOwnProperty('total'));
    assert.strictEqual(res.body.total, 500);

    // Verificar que se agregó correctamente
    const allPedidos = await request(app).get('/api/pedidos');
    assert.strictEqual(allPedidos.body.length, 2);
  });

  it('PUT /api/pedidos/:id debe actualizar un pedido', async () => {
    const updatedPedido = {
      total: 1200,
      estado: 'Completado',
      fechaPedido: '2024-11-30',
      idMetodoV: 3,
      idProveedor: 2
    };
    const res = await request(app).put('/api/pedidos/1').send(updatedPedido);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('estado'));
    assert.strictEqual(res.body.estado, 'Completado');
  });

  it('DELETE /api/pedidos/:id debe eliminar un pedido', async () => {
    const res = await request(app).delete('/api/pedidos/1');
    assert.strictEqual(res.status, 204);

    // Verificar que el pedido fue eliminado
    const allPedidos = await request(app).get('/api/pedidos');
    assert.strictEqual(allPedidos.body.length, 1);
  });

  it('GET /api/pedidos/:id debe retornar 404 para un pedido inexistente', async () => {
    const res = await request(app).get('/api/pedidos/9999');
    assert.strictEqual(res.status, 404);
  });
});

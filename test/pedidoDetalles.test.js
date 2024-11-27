const request = require('supertest');
const app = require('../src/pedidoDetalles.js'); // Ruta al archivo principal de la app
const db = require('../config/database');
const assert = require('assert');

// Configuración inicial para las pruebas
require('./testSetup'); // Configuración global para limpiar datos entre pruebas

describe('PedidoDetalles API Endpoints', () => {
  before(async () => {
    // Limpiar la tabla y agregar datos iniciales
    await db.query('TRUNCATE TABLE PedidoDetalles RESTART IDENTITY CASCADE');
    await db.query("INSERT INTO PedidoDetalles (idPedido, idProducto, cantidad) VALUES (1, 101, 5)");
  });

  after(async () => {
    // Limpiar la tabla después de las pruebas
    await db.query('TRUNCATE TABLE PedidoDetalles RESTART IDENTITY CASCADE');
  });

  it('GET /api/pedidoDetalles debe retornar todos los detalles de pedidos', async () => {
    const res = await request(app).get('/api/pedidoDetalles');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 1);
  });

  it('GET /api/pedidoDetalles/:idPedido/:idProducto debe retornar un detalle por ID', async () => {
    const res = await request(app).get('/api/pedidoDetalles/1/101');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('cantidad'));
    assert.strictEqual(res.body.cantidad, 5);
  });

  it('POST /api/pedidoDetalles debe crear un nuevo detalle de pedido', async () => {
    const newDetalle = { idPedido: 2, idProducto: 202, cantidad: 3 };
    const res = await request(app).post('/api/pedidoDetalles').send(newDetalle);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.hasOwnProperty('idPedido'));
    assert.strictEqual(res.body.idPedido, 2);

    // Verificar que se agregó correctamente
    const allDetalles = await request(app).get('/api/pedidoDetalles');
    assert.strictEqual(allDetalles.body.length, 2);
  });

  it('PUT /api/pedidoDetalles/:idPedido/:idProducto debe actualizar un detalle de pedido', async () => {
    const updatedDetalle = { cantidad: 10 };
    const res = await request(app).put('/api/pedidoDetalles/1/101').send(updatedDetalle);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('cantidad'));
    assert.strictEqual(res.body.cantidad, 10);
  });

  it('DELETE /api/pedidoDetalles/:idPedido/:idProducto debe eliminar un detalle de pedido', async () => {
    const res = await request(app).delete('/api/pedidoDetalles/1/101');
    assert.strictEqual(res.status, 204);

    // Verificar que el detalle fue eliminado
    const allDetalles = await request(app).get('/api/pedidoDetalles');
    assert.strictEqual(allDetalles.body.length, 1); // Queda solo 1 detalle
  });

  it('GET /api/pedidoDetalles/:idPedido/:idProducto debe retornar 404 para un detalle inexistente', async () => {
    const res = await request(app).get('/api/pedidoDetalles/9999/9999');
    assert.strictEqual(res.status, 404);
  });
});

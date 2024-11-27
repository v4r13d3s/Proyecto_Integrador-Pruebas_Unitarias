const request = require('supertest');
const app = require('../src/detalleVentas'); 
const db = require('../config/database');
const assert = require('assert');

require('./testSetup');

describe('DetalleVentas API Endpoints', () => {
  before(async () => {
    // Limpiar las tablas y establecer datos iniciales
    await db.query('TRUNCATE TABLE DetalleVentas RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE Productos RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE Categorias RESTART IDENTITY CASCADE');

    // Insertar categorías de ejemplo con nombre y descripcion
    await db.query(
      "INSERT INTO Categorias (idCategoria, nombre, descripcion) VALUES (1, 'Electrónica', 'Categoría de productos electrónicos')"
    );
    await db.query(
      "INSERT INTO Categorias (idCategoria, nombre, descripcion) VALUES (2, 'Ropa', 'Categoría de ropa y vestimenta')"
    );

    // Insertar productos con una categoría asignada
    await db.query(
      "INSERT INTO Productos (idProducto, nombre, precio, descripcion, stock, idCategoria) VALUES (101, 'Producto A', 450.0, 'Descripción del producto A', 100, 1)"
    );
    await db.query(
      "INSERT INTO Productos (idProducto, nombre, precio, descripcion, stock, idCategoria) VALUES (102, 'Producto B', 500.0, 'Descripción del producto B', 50, 2)"
    );

    // Insertar un detalle de ventas con productos existentes
    await db.query(
      "INSERT INTO DetalleVentas (folio, idProducto, cantidad, total) VALUES (1, 101, 2, 900)"
    );
  });

  after(async () => {
    // Restaurar el estado inicial de las tablas (sin cerrar la conexión, ya lo maneja el archivo global)
    await db.query('TRUNCATE TABLE DetalleVentas RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE Productos RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE Categorias RESTART IDENTITY CASCADE');
  });

  it('GET /api/detalleVentas debe retornar todos los detalles de ventas', async () => {
    const res = await request(app).get('/api/detalleVentas');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 1);
  });

  it('GET /api/detalleVentas/:folio/:idProducto debe retornar un detalle específico', async () => {
    const res = await request(app).get('/api/detalleVentas/1/101');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('cantidad'));
    assert.strictEqual(res.body.cantidad, 2);
    assert.ok(res.body.hasOwnProperty('total'));
    assert.strictEqual(res.body.total, 900);
  });

  it('POST /api/detalleVentas debe crear un nuevo detalle de venta', async () => {
    const newDetalle = { folio: 2, idProducto: 102, cantidad: 3, total: 1350 };
    const res = await request(app).post('/api/detalleVentas').send(newDetalle);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.hasOwnProperty('folio'));
    assert.strictEqual(res.body.folio, 2);

    // Verificar que se agregó el nuevo detalle
    const allDetalles = await request(app).get('/api/detalleVentas');
    assert.strictEqual(allDetalles.body.length, 2);
  });

  it('PUT /api/detalleVentas/:folio/:idProducto debe actualizar un detalle', async () => {
    const updatedDetalle = { cantidad: 5, total: 2250 };
    const res = await request(app).put('/api/detalleVentas/1/101').send(updatedDetalle);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('cantidad'));
    assert.strictEqual(res.body.cantidad, 5);
    assert.ok(res.body.hasOwnProperty('total'));
    assert.strictEqual(res.body.total, 2250);
  });

  it('DELETE /api/detalleVentas/:folio/:idProducto debe eliminar un detalle', async () => {
    const res = await request(app).delete('/api/detalleVentas/1/101');
    assert.strictEqual(res.status, 204);

    // Verificar que el detalle fue eliminado
    const allDetalles = await request(app).get('/api/detalleVentas');
    assert.strictEqual(allDetalles.body.length, 1);
  });

  it('GET /api/detalleVentas/:folio/:idProducto debe retornar 404 para un detalle inexistente', async () => {
    const res = await request(app).get('/api/detalleVentas/9999/9999');
    assert.strictEqual(res.status, 404);
  });
});

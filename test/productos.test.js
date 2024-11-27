const request = require('supertest');
const app = require('../src/productos.js'); // Ruta al archivo principal de la app
const db = require('../config/database');
const assert = require('assert');

// Configuración inicial para las pruebas
require('./testSetup'); // Configuración global para limpiar datos entre pruebas

describe('Productos API Endpoints', () => {
  before(async () => {
    // Limpiar la tabla y agregar datos iniciales
    await db.query('TRUNCATE TABLE Productos RESTART IDENTITY CASCADE');
    await db.query("INSERT INTO Productos (nombre, descripcion, precio, stock, idcategoria) VALUES ('Laptop', 'Portátil de alto rendimiento', 1500, 10, 1)");
  });

  after(async () => {
    // Limpiar la tabla después de las pruebas
    await db.query('TRUNCATE TABLE Productos RESTART IDENTITY CASCADE');
  });

  it('GET /api/productos debe retornar todos los productos', async () => {
    const res = await request(app).get('/api/productos');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 1);
  });

  it('GET /api/productos/:id debe retornar un producto por ID', async () => {
    const res = await request(app).get('/api/productos/1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Laptop');
  });

  it('POST /api/productos debe crear un nuevo producto', async () => {
    const newProducto = {
      nombre: 'Mouse',
      descripcion: 'Mouse inalámbrico',
      precio: 20,
      stock: 50,
      idcategoria: 2
    };
    const res = await request(app).post('/api/productos').send(newProducto);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Mouse');

    // Verificar que se agregó correctamente
    const allProductos = await request(app).get('/api/productos');
    assert.strictEqual(allProductos.body.length, 2);
  });

  it('PUT /api/productos/:id debe actualizar un producto', async () => {
    const updatedProducto = {
      nombre: 'Laptop Gamer',
      descripcion: 'Portátil con tarjeta gráfica potente',
      precio: 1800,
      stock: 8,
      idcategoria: 1
    };
    const res = await request(app).put('/api/productos/1').send(updatedProducto);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Laptop Gamer');
  });

  it('DELETE /api/productos/:id debe eliminar un producto', async () => {
    const res = await request(app).delete('/api/productos/1');
    assert.strictEqual(res.status, 204);

    // Verificar que el producto fue eliminado
    const allProductos = await request(app).get('/api/productos');
    assert.strictEqual(allProductos.body.length, 1);
  });

  it('GET /api/productos/:id debe retornar 404 para un producto inexistente', async () => {
    const res = await request(app).get('/api/productos/9999');
    assert.strictEqual(res.status, 404);
  });
});

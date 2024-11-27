const request = require('supertest');
const app = require('../src/categorias'); // Importamos la app para hacer las pruebas
const db = require('../config/database');
const assert = require('assert');

// Importar archivo de configuración para manejo global de la base de datos
require('./testSetup'); // Este archivo se encargará de cerrar la conexión globalmente

describe('Categorías API Endpoints', () => {
  before(async () => {
    // Limpiar los datos existentes en la tabla y establecer datos iniciales
    await db.query('TRUNCATE TABLE Categorias RESTART IDENTITY CASCADE');
    await db.query("INSERT INTO Categorias (nombre, descripcion) VALUES ('General', 'Categoría general')");
  });

  after(async () => {
    // Restaurar el estado inicial de la tabla (sin cerrar la conexión, ya lo maneja el archivo global)
    await db.query('TRUNCATE TABLE Categorias RESTART IDENTITY CASCADE');
  });

  it('GET /api/categorias debe retornar todas las categorías', async () => {
    const res = await request(app).get('/api/categorias');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 1);
  });

  it('GET /api/categorias/:id debe retornar una categoría por ID', async () => {
    const res = await request(app).get('/api/categorias/1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'General');
  });

  it('POST /api/categorias debe crear una nueva categoría', async () => {
    const newCategoria = { nombre: 'Electronica', descripcion: 'Categoría relacionada con Electronica' };
    const res = await request(app).post('/api/categorias').send(newCategoria);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Electronica');

    // Verificar que la categoría se agregó
    const allCategorias = await request(app).get('/api/categorias');
    assert.strictEqual(allCategorias.body.length, 2);
  });

  it('PUT /api/categorias/:id debe actualizar una categoría', async () => {
    const updatedCategoria = { nombre: 'Papeleria', descripcion: 'Categoría relacionada con Papeleria' };
    const res = await request(app).put('/api/categorias/1').send(updatedCategoria);
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.hasOwnProperty('nombre'));
    assert.strictEqual(res.body.nombre, 'Papeleria');
  });

  it('DELETE /api/categorias/:id debe eliminar una categoría', async () => {
    const res = await request(app).delete('/api/categorias/1');
    assert.strictEqual(res.status, 204);

    // Verificar que la categoría fue eliminada
    const allCategorias = await request(app).get('/api/categorias');
    assert.strictEqual(allCategorias.body.length, 1); // La categoría eliminada ya no debería estar
  });

  it('GET /api/categorias/:id debe retornar 404 para categoría inexistente', async () => {
    const res = await request(app).get('/api/categorias/9999');
    assert.strictEqual(res.status, 404);
  });
});

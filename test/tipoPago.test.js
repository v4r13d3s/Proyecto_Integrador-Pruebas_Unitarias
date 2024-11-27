const request = require('supertest');
const app = require('../src/tipoPago.js'); // Asegúrate de exportar la app desde tiposPago.js
const db = require('../config/database');
const assert = require('assert');

require('./testSetup');

describe('Tipos de Pago API Endpoints', () => {
  before(async () => {
    // Reiniciar tabla TipoPago y configurar datos iniciales
    await db.query('TRUNCATE TABLE TipoPago RESTART IDENTITY CASCADE');

    // Insertar datos iniciales de tipos de pago
    await db.query(`
      INSERT INTO TipoPago (descripcion, fecha_creacion, activo)
      VALUES 
        ('Efectivo', NOW(), TRUE),
        ('Tarjeta de crédito', NOW(), TRUE);
    `);
  });

  after(async () => {
    // Limpiar la tabla TipoPago después de las pruebas
    await db.query('TRUNCATE TABLE TipoPago RESTART IDENTITY CASCADE');
  });

  it('GET /api/tipos-pago debe retornar todos los tipos de pago', async () => {
    const res = await request(app).get('/api/tipos-pago');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 2); 
    assert.strictEqual(res.body[0].descripcion, 'Efectivo');
    assert.strictEqual(res.body[1].descripcion, 'Tarjeta de crédito');
  });

  it('GET /api/tipos-pago/:id debe retornar un tipo de pago por ID', async () => {
    const res = await request(app).get('/api/tipos-pago/1');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.descripcion, 'Efectivo');
  });

  it('POST /api/tipos-pago debe crear un nuevo tipo de pago', async () => {
    const newTipo = {
      descripcion: 'Transferencia bancaria',
      activo: true,
    };
    const res = await request(app).post('/api/tipos-pago').send(newTipo);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.descripcion, 'Transferencia bancaria');
    assert.strictEqual(res.body.activo, true);
  });

  it('POST /api/tipos-pago debe fallar con datos inválidos', async () => {
    const invalidTipo = {
      descripcion: '', // Descripción vacía
      activo: 'invalid', // Valor no booleano
    };
    const res = await request(app).post('/api/tipos-pago').send(invalidTipo);
    assert.strictEqual(res.status, 400);
    assert.ok(Array.isArray(res.body.errores));
    assert.ok(res.body.errores.length > 0);
  });

  it('PUT /api/tipos-pago/:id debe actualizar un tipo de pago existente', async () => {
    const updatedTipo = {
      descripcion: 'Efectivo Modificado',
      activo: false,
    };
    const res = await request(app).put('/api/tipos-pago/1').send(updatedTipo);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.descripcion, 'Efectivo Modificado');
    assert.strictEqual(res.body.activo, false);
  });

  it('DELETE /api/tipos-pago/:id debe eliminar un tipo de pago existente', async () => {
    const res = await request(app).delete('/api/tipos-pago/1');
    assert.strictEqual(res.status, 204);

    // Verificar que el tipo de pago fue eliminado
    const getRes = await request(app).get('/api/tipos-pago/1');
    assert.strictEqual(getRes.status, 404);
  });

  it('GET /api/tipos-pago/:id debe retornar 404 para un tipo de pago inexistente', async () => {
    const res = await request(app).get('/api/tipos-pago/9999'); // ID inexistente
    assert.strictEqual(res.status, 404);
  });
});

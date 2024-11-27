const request = require('supertest');
const app = require('../src/proveedores.js'); // Asegúrate de exportar la app desde proveedores.js
const db = require('../config/database');
const assert = require('assert');

require('./testSetup');

describe('Proveedores API Endpoints', () => {
  before(async () => {
    await db.query('TRUNCATE TABLE Proveedores RESTART IDENTITY CASCADE');

    // Insertar datos iniciales válidos
    await db.query(`
      INSERT INTO Proveedores (nombre, direccion, rfc, telefono)
      VALUES 
        ('Proveedor XYZ', 'Calle Principal 123, Ciudad', 'RFC123456789A', '5551234561'),
        ('Proveedor ABC', 'Calle Secundaria 456, Ciudad', 'RFC987654321B', '5551234562');
    `);
  });

  after(async () => {
    await db.query('TRUNCATE TABLE Proveedores RESTART IDENTITY CASCADE');
  });

  it('GET /api/proveedores debe retornar todos los proveedores', async () => {
    const res = await request(app).get('/api/proveedores');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(Array.isArray(res.body), true);
    assert.strictEqual(res.body.length, 2);
  });

  it('GET /api/proveedores/:id debe retornar un proveedor por ID', async () => {
    const res = await request(app).get('/api/proveedores/1');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.nombre, 'Proveedor XYZ');
  });

  it('POST /api/proveedores debe crear un nuevo proveedor', async () => {
    const newProveedor = {
      nombre: 'Proveedor DEF',
      direccion: 'Calle Tercera 789',
      rfc: 'RFC112233445C',
      telefono: '5551234563',
    };
    const res = await request(app).post('/api/proveedores').send(newProveedor);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.nombre, 'Proveedor DEF');
  });

  it('POST /api/proveedores debe fallar con datos inválidos', async () => {
    const invalidProveedor = {
      nombre: '',
      direccion: 'Dirección sin nombre',
      rfc: '123', // RFC inválido
      telefono: '123456', // Teléfono inválido
    };
    const res = await request(app).post('/api/proveedores').send(invalidProveedor);
    assert.strictEqual(res.status, 400);
  });

  it('PUT /api/proveedores/:id debe actualizar un proveedor existente', async () => {
    const updatedProveedor = {
      nombre: 'Proveedor XYZ Modificado',
      direccion: 'Nueva dirección',
      rfc: 'RFC0987654321',
      telefono: '5559876543',
    };
    const res = await request(app).put('/api/proveedores/1').send(updatedProveedor);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.nombre, 'Proveedor XYZ Modificado');
  });

  it('DELETE /api/proveedores/:id debe eliminar un proveedor existente', async () => {
    const res = await request(app).delete('/api/proveedores/1');
    assert.strictEqual(res.status, 204);

    // Verificar que fue eliminado
    const getRes = await request(app).get('/api/proveedores/1');
    assert.strictEqual(getRes.status, 404);
  });
});

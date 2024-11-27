const request = require('supertest');
const app = require('../src/metodoVenta.js'); // Asegúrate de que este archivo exporte la app
const db = require('../config/database');
const assert = require('assert');

require('./testSetup');

describe('Métodos de Venta API Endpoints', () => {
    before(async () => {
        // Reiniciar tablas relacionadas y configurar datos iniciales
        await db.query('TRUNCATE TABLE MetodoVenta RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE tipoPago RESTART IDENTITY CASCADE');

        // Insertar tipos de pago
        await db.query(`
      INSERT INTO tipoPago (descripcion, fecha_creacion, activo) 
      VALUES ('Efectivo', NOW(), TRUE), ('Tarjeta de crédito', NOW(), TRUE);
    `);

        // Insertar métodos de venta
        await db.query(`
      INSERT INTO MetodoVenta (idTipoPago, descripcion, comision, fecha_creacion, activo)
      VALUES 
        (1, 'Efectivo', 0.00, NOW(), TRUE), 
        (2, 'Tarjeta de crédito', 0.05, NOW(), TRUE);
    `);
    });

    after(async () => {
        await db.query('TRUNCATE TABLE MetodoVenta RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE tipoPago RESTART IDENTITY CASCADE');
    });

    it('GET /api/metodos-venta debe retornar todos los métodos de venta', async () => {
        const res = await request(app).get('/api/metodos-venta');
        assert.strictEqual(res.status, 200);
        assert.strictEqual(Array.isArray(res.body), true);
        assert.strictEqual(res.body.length, 2);
        assert.strictEqual(res.body[0].descripcion, 'Efectivo');
    });

    it('GET /api/metodos-venta/:id debe retornar un método de venta por ID', async () => {
        const res = await request(app).get('/api/metodos-venta/1');
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.descripcion, 'Efectivo');
    });

    it('POST /api/metodos-venta debe crear un nuevo método de venta', async () => {
        const newMetodo = {
            idTipoPago: 1,
            descripcion: 'Transferencia Bancaria',
            comision: 0.02,
            activo: true,
        };
        const res = await request(app).post('/api/metodos-venta').send(newMetodo);
        assert.strictEqual(res.status, 201);
        assert.strictEqual(res.body.descripcion, 'Transferencia Bancaria');
    });

    it('POST /api/metodos-venta debe fallar con datos inválidos', async () => {
        const invalidMetodo = {
            idTipoPago: 99, // No existe
            descripcion: 'AB', // Descripción muy corta
            comision: 1.5, // Comisión fuera de rango
            activo: 'true', // No es booleano
        };
        const res = await request(app).post('/api/metodos-venta').send(invalidMetodo);
        assert.strictEqual(res.status, 400);
        assert.ok(Array.isArray(res.body.errores));
        assert.ok(res.body.errores.length > 0);
    });



    it('PUT /api/metodos-venta/:id debe actualizar un método de venta', async () => {
        const updatedMetodo = {
            idTipoPago: 2,
            descripcion: 'Pago con Tarjeta',
            comision: 0.03,
            activo: false,
        };
        const res = await request(app).put('/api/metodos-venta/1').send(updatedMetodo);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.descripcion, 'Pago con Tarjeta');
        assert.strictEqual(Number(res.body.comision), 0.03); // Convertir a número para la comparación
    });
    


    it('DELETE /api/metodos-venta/:id debe eliminar un método de venta', async () => {
        const res = await request(app).delete('/api/metodos-venta/1');
        assert.strictEqual(res.status, 204);

        // Verificar que el método de venta fue eliminado
        const getRes = await request(app).get('/api/metodos-venta/1');
        assert.strictEqual(getRes.status, 404);
    });

    it('GET /api/metodos-venta/:id debe retornar 404 para un método inexistente', async () => {
        const res = await request(app).get('/api/metodos-venta/9999');
        assert.strictEqual(res.status, 404);
    });
});

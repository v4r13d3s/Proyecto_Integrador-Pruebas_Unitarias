const request = require('supertest');
const app = require('../src/pedidos.js'); 
const db = require('../config/database');
const assert = require('assert');

require('./testSetup');

describe('Pedidos API Endpoints', () => {
    before(async () => {
        // Reiniciar tablas relacionadas y configurar datos iniciales
        await db.query('TRUNCATE TABLE Pedidos RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE Proveedores RESTART IDENTITY CASCADE');
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

        // Insertar proveedores
        await db.query(`
            INSERT INTO Proveedores (nombre, direccion, rfc, telefono)
            VALUES 
                ('Proveedor XYZ', 'Calle Principal 123', 'RFC123456789', '5551234561'),
                ('Proveedor ABC', 'Calle Secundaria 456', 'RFC987654321', '5551234562');
        `);

        // Insertar pedidos
        await db.query(`
            INSERT INTO Pedidos (total, estado, fechaPedido, idMetodoV, idProveedor)
            VALUES 
                (1200.50, 'Pendiente', NOW(), 1, 1),
                (850.75, 'Completado', NOW(), 2, 2);
        `);
    });

    after(async () => {
        await db.query('TRUNCATE TABLE Pedidos RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE Proveedores RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE MetodoVenta RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE tipoPago RESTART IDENTITY CASCADE');
    });

    it('GET /api/pedidos debe retornar todos los pedidos', async () => {
        const res = await request(app).get('/api/pedidos');
        assert.strictEqual(res.status, 200);
        assert.strictEqual(Array.isArray(res.body), true);
        assert.strictEqual(res.body.length, 2);
        assert.strictEqual(res.body[0].estado, 'Pendiente');
    });

    it('GET /api/pedidos/:id debe retornar un pedido por ID', async () => {
        const res = await request(app).get('/api/pedidos/1');
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.estado, 'Pendiente');
    });

    it('POST /api/pedidos debe crear un nuevo pedido', async () => {
        const newPedido = {
            total: 500.00,
            estado: 'Pendiente',
            idMetodoV: 1,
            idProveedor: 1,
        };
        const res = await request(app).post('/api/pedidos').send(newPedido);
        assert.strictEqual(res.status, 201);
        assert.strictEqual(res.body.estado, 'Pendiente');
    });

    it('POST /api/pedidos debe fallar con datos inválidos', async () => {
        const invalidPedido = {
            total: -100, // Total inválido
            estado: '', // Estado vacío
            idMetodoV: 999, // Método de venta inexistente
            idProveedor: 999, // Proveedor inexistente
        };
        const res = await request(app).post('/api/pedidos').send(invalidPedido);
        assert.strictEqual(res.status, 400);
    });

    it('PUT /api/pedidos/:id debe actualizar un pedido', async () => {
        const updatedPedido = {
            total: 1300.00,
            estado: 'Completado',
            idMetodoV: 2,
            idProveedor: 2,
        };
        const res = await request(app).put('/api/pedidos/1').send(updatedPedido);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.estado, 'Completado');
    });

    it('DELETE /api/pedidos/:id debe eliminar un pedido', async () => {
        const res = await request(app).delete('/api/pedidos/1');
        assert.strictEqual(res.status, 204);

        // Verificar que el pedido fue eliminado
        const getRes = await request(app).get('/api/pedidos/1');
        assert.strictEqual(getRes.status, 404);
    });

    it('GET /api/pedidos/:id debe retornar 404 para un pedido inexistente', async () => {
        const res = await request(app).get('/api/pedidos/9999');
        assert.strictEqual(res.status, 404);
    });
});

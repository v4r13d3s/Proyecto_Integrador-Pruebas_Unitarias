const request = require('supertest');
const app = require('../src/pedidoDetalles.js');
const db = require('../config/database');
const assert = require('assert');

require('./testSetup');

describe('PedidoDetalles API Endpoints', () => {
    before(async () => {
        // Reiniciar tablas relacionadas y configurar datos iniciales
        await db.query('TRUNCATE TABLE PedidoDetalles RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE Pedidos RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE Productos RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE Categorias RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE MetodoVenta RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE tipoPago RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE Proveedores RESTART IDENTITY CASCADE');

        // Insertar categorías
        await db.query(`
            INSERT INTO Categorias (nombre, descripcion)
            VALUES 
                ('Electrónicos', 'Productos electrónicos de consumo'),
                ('Papelería', 'Productos de papelería y oficina');
        `);

        // Insertar productos
        await db.query(`
            INSERT INTO Productos (nombre, descripcion, precio, stock, idCategoria)
            VALUES 
                ('Smartphone', 'Teléfono inteligente de última generación', 899.99, 50, 1),
                ('Lápiz', 'Lápiz de grafito HB', 0.99, 1000, 2);
        `);

        // Insertar tipos de pago y métodos de venta
        await db.query(`
            INSERT INTO tipoPago (descripcion, fecha_creacion, activo) 
            VALUES ('Efectivo', NOW(), TRUE), ('Tarjeta de crédito', NOW(), TRUE);
        `);

        await db.query(`
            INSERT INTO MetodoVenta (idTipoPago, descripcion, comision, fecha_creacion, activo)
            VALUES 
                (1, 'Efectivo', 0.00, NOW(), TRUE), 
                (2, 'Tarjeta de crédito', 0.05, NOW(), TRUE);
        `);

        // Insertar proveedores y pedidos
        await db.query(`
            INSERT INTO Proveedores (nombre, direccion, rfc, telefono)
            VALUES ('Proveedor XYZ', 'Calle Principal 123', 'RFC123456789', '5551234561');
        `);

        await db.query(`
            INSERT INTO Pedidos (total, estado, fechaPedido, idMetodoV, idProveedor)
            VALUES 
                (1200.50, 'Pendiente', NOW(), 1, 1);
        `);

        // Insertar detalle de pedido inicial
        await db.query(`
            INSERT INTO PedidoDetalles (idPedido, idProducto, cantidad, subtotal, iva)
            VALUES (1, 1, 5, 500.00, 80.00);
        `);
    });

    after(async () => {
        await db.query('TRUNCATE TABLE PedidoDetalles RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE Pedidos RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE Productos RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE MetodoVenta RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE tipoPago RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE Proveedores RESTART IDENTITY CASCADE');
    });

    it('GET /api/pedido-detalles debe retornar todos los detalles de pedidos', async () => {
        const res = await request(app).get('/api/pedido-detalles');
        assert.strictEqual(res.status, 200);
        assert.strictEqual(Array.isArray(res.body), true);
        assert.strictEqual(res.body.length, 1);
    });

    it('GET /api/pedido-detalles/:idPedido/:idProducto debe retornar un detalle de pedido por ID', async () => {
        const res = await request(app).get('/api/pedido-detalles/1/1');
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.cantidad, 5);
    });

    it('POST /api/pedido-detalles debe crear un nuevo detalle de pedido', async () => {
        const newDetalle = {
            idPedido: 1,
            idProducto: 2,
            cantidad: 10,
        };
        const res = await request(app).post('/api/pedido-detalles').send(newDetalle);
        assert.strictEqual(res.status, 201);
        assert.strictEqual(res.body.cantidad, 10);
    });

    it('POST /api/pedido-detalles debe fallar si el stock es insuficiente', async () => {
        const invalidDetalle = {
            idPedido: 1,
            idProducto: 2,
            cantidad: 2000, // Mayor que el stock
        };
        const res = await request(app).post('/api/pedido-detalles').send(invalidDetalle);
        assert.strictEqual(res.status, 400);
    });

    it('POST /api/pedido-detalles debe fallar si el detalle ya existe', async () => {
        const duplicateDetalle = {
            idPedido: 1,
            idProducto: 1,
            cantidad: 5,
        };
        const res = await request(app).post('/api/pedido-detalles').send(duplicateDetalle);
        assert.strictEqual(res.status, 400);
    });

    it('PUT /api/pedido-detalles/:idPedido/:idProducto debe actualizar un detalle de pedido', async () => {
        const updatedDetalle = { cantidad: 15 };
        const res = await request(app).put('/api/pedido-detalles/1/1').send(updatedDetalle);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.cantidad, 15);
    });

    it('DELETE /api/pedido-detalles/:idPedido/:idProducto debe eliminar un detalle de pedido', async () => {
        const res = await request(app).delete('/api/pedido-detalles/1/1');
        assert.strictEqual(res.status, 204);

        // Verificar que fue eliminado
        const getRes = await request(app).get('/api/pedido-detalles/1/1');
        assert.strictEqual(getRes.status, 404);
    });

    it('GET /api/pedido-detalles/:idPedido/:idProducto debe retornar 404 para un detalle inexistente', async () => {
        const res = await request(app).get('/api/pedido-detalles/9999/9999');
        assert.strictEqual(res.status, 404);
    });
});

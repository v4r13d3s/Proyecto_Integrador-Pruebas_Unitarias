const request = require('supertest');
const app = require('../src/productos.js'); // Ensure this exports the app for testing
const db = require('../config/database');
const assert = require('assert');

require('./testSetup');

describe('Productos API Endpoints', () => {
    before(async () => {
        // Reset tables and set up initial data
        await db.query('TRUNCATE TABLE Productos RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE Categorias RESTART IDENTITY CASCADE');

        // Insert categories
        await db.query(`
            INSERT INTO Categorias (nombre, descripcion)
            VALUES 
                ('Electrónicos', 'Productos electrónicos de consumo'),
                ('Papelería', 'Productos de papelería y oficina');
        `);

        // Insert initial products
        await db.query(`
            INSERT INTO Productos (nombre, descripcion, precio, stock, idcategoria)
            VALUES 
                ('Smartphone', 'Teléfono inteligente de última generación', 899.99, 50, 1),
                ('Lápiz', 'Lápiz de grafito HB', 0.99, 1000, 2);
        `);
    });

    after(async () => {
        await db.query('TRUNCATE TABLE Productos RESTART IDENTITY CASCADE');
        await db.query('TRUNCATE TABLE Categorias RESTART IDENTITY CASCADE');
    });

    it('GET /api/productos debe retornar todos los productos', async () => {
        const res = await request(app).get('/api/productos');
        assert.strictEqual(res.status, 200);
        assert.strictEqual(Array.isArray(res.body), true);
        assert.strictEqual(res.body.length, 2);
        assert.strictEqual(res.body[0].nombre, 'Smartphone');
    });

    it('GET /api/productos/:id debe retornar un producto por ID', async () => {
        const res = await request(app).get('/api/productos/1');
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.nombre, 'Smartphone');
    });

    it('GET /api/productos/:id debe retornar 404 para un producto inexistente', async () => {
        const res = await request(app).get('/api/productos/9999');
        assert.strictEqual(res.status, 404);
    });

    it('POST /api/productos debe crear un nuevo producto', async () => {
        const newProducto = {
            nombre: 'Tablet',
            descripcion: 'Tablet de última generación',
            precio: 499.99,
            stock: 30,
            idcategoria: 1,
        };
        const res = await request(app).post('/api/productos').send(newProducto);
        assert.strictEqual(res.status, 201);
        assert.strictEqual(res.body.nombre, 'Tablet');
    });

    it('POST /api/productos debe fallar con datos inválidos', async () => {
        const invalidProducto = {
            nombre: '', // Nombre vacío
            descripcion: 'Producto inválido',
            precio: -100, // Precio negativo
            stock: -10, // Stock negativo
            idcategoria: 9999, // Categoría inexistente
        };
        const res = await request(app).post('/api/productos').send(invalidProducto);
        assert.strictEqual(res.status, 400);
    });

    it('PUT /api/productos/:id debe actualizar un producto existente', async () => {
        const updatedProducto = {
            nombre: 'Smartphone Pro',
            descripcion: 'Teléfono inteligente avanzado',
            precio: 999.99,
            stock: 60,
            idcategoria: 1,
        };
        const res = await request(app).put('/api/productos/1').send(updatedProducto);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.nombre, 'Smartphone Pro');
    });

    it('PUT /api/productos/:id debe retornar 404 para un producto inexistente', async () => {
        const updatedProducto = {
            nombre: 'Producto Fantasma',
            descripcion: 'Descripción fantasma',
            precio: 100,
            stock: 10,
            idcategoria: 1,
        };
        const res = await request(app).put('/api/productos/9999').send(updatedProducto);
        assert.strictEqual(res.status, 404);
    });

    it('DELETE /api/productos/:id debe eliminar un producto existente', async () => {
        const res = await request(app).delete('/api/productos/1');
        assert.strictEqual(res.status, 204);

        // Verify it was deleted
        const getRes = await request(app).get('/api/productos/1');
        assert.strictEqual(getRes.status, 404);
    });

    it('DELETE /api/productos/:id debe retornar 404 para un producto inexistente', async () => {
        const res = await request(app).delete('/api/productos/9999');
        assert.strictEqual(res.status, 404);
    });
});

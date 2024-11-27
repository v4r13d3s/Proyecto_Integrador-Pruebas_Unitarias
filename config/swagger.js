const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

//Configuracion de swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Store', //Titulo de la documentacion 
            version: '1.0.0',
            description: 'Documentacion de API de Gestion de catalagos'
        },
        servers: [
            {
                url: 'http://localhost:'+process.env.APP_PORT , //URL base de datos del servidor de la API
            },
        ],
    },
    apis: ['./routes/*.js'], // Rutas donde estas tus archivos de rutas para generar la documentacion automatica
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve,
        swaggerUi.setup(swaggerSpec));
    console.log('Swagger docs available at http://localhost:'+
        process.env.APP_PORT+'/api-docs');
};

module.exports = swaggerDocs;
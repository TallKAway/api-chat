const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');


const options = {
    
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Chat',
      version: '1.0.0',
        description: 'Documentation for the API Chat service',
    },
    },
    apis: [path.resolve(__dirname, '../controllers/ChatController.js')],

};

const specs = swaggerJsdoc(options);

module.exports = specs;

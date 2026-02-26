import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Soporte2026 API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000' }]
  },
  apis: ['src/routes/*.ts']
});

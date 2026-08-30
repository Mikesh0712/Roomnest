import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RoomNest Hyperlocal Rental Platform API',
      version: '1.0.0',
      description: 'Production-ready REST API for RoomNest — Hyperlocal rental and relocation platform for students, working professionals, bachelors, couples, and families across India.',
      contact: {
        name: 'RoomNest Engineering Team',
        email: 'support@roomnest.in'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide JWT token in format: Bearer <token>'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/app.js']
};

export const swaggerSpec = swaggerJSDoc(options);

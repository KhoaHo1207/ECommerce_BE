// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0", // Chuẩn OpenAPI version
    info: {
      title: "ShopSphere API Documentation",
      version: "1.0.0",
      description: "API documentation for my Node.js Express project",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1", // URL gốc của API
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"], // Nơi viết mô tả API (swagger comments)
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

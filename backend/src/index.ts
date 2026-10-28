/**
 * Application Bootstrap and Server Entry Point.
 * Configures global security middlewares, registers API routes,
 * mounts the global error handler, and starts the HTTP listener.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerDocument } from './docs/swagger';

export const app = express();

// Security and standard request parsing middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Swagger UI inline scripts and assets
  })
);
app.use(cors());
app.use(express.json());

// API Documentation via Swagger OpenAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Main API routing namespace
app.use('/api', routes);

// Central error-handling pipeline
app.use(errorHandler);

// Start server listener when executed directly (excluded during automated tests)
if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`[Backend] Server listening on http://localhost:${env.PORT}`);
    console.log(`[Backend] Environment: ${env.NODE_ENV}`);
  });
}

export default app;

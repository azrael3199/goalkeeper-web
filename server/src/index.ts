/* eslint-disable no-console */
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import typeDefs from './schema';
import resolvers from './resolvers';
import { Context } from './common';
import authMiddleware, {
  type RequestWithContext,
} from './middlewares/auth.middleware';
import router from './routes';

dotenv.config();

// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

// CORS Settings
const corsOptions = {
  origin: process.env.NODE_ENV === 'development' ? '*' : '',
  credentials: true,
};

app.use(cors(corsOptions));

// Use our normal REST APIs
app.use('/api/v1', authMiddleware, router);

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
// Ensure we wait for our server to start
server.start().then(async () => {
  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    authMiddleware,
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }) => ({ ...(req as RequestWithContext).context }),
    })
  );

  // Modified server startup
  await new Promise<void>((resolve) => {
    httpServer.listen({ port: 4000 }, resolve);
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('🚀 GraphQL Server ready at http://localhost:4000/graphql');
    console.log('🚀 HTTP Server ready at http://localhost:4000/api/v1');
  }
});

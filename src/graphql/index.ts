import { ApolloServer, gql } from "apollo-server-express";
import config from "config";
import { Express, Request } from "express";
import GraphQLDateTime from "graphql-type-datetime";
import { Server } from "http";
import { get, merge } from "lodash";
import minifyGql from "minify-graphql-loader";
import morgan from "morgan";
import path from "path";
import { walkSyncFiles } from "../helpers/common";
import logger from "../helpers/logger";
import { onContext } from "./context";

export default (app: Express, httpServer: Server) => {
  const typeDefs = [
    gql`
      scalar Mixed
      scalar DateTime

      type Query {
        _empty: String
      }
      type Mutation {
        _empty: String
      }
      type Subscription {
        _empty: String
      }
      input QueryGetListInput {
        limit: Int
        offset: Int
        page: Int
        order: Mixed
        filter: Mixed
        search: String
      }

      type Pagination {
        limit: Int
        offset: Int
        page: Int
        total: Int
      }
    `,
  ];

  let resolvers = {
    DateTime: GraphQLDateTime,
  };

  const ModuleFiles = walkSyncFiles(path.join(__dirname, "modules"));
  ModuleFiles.filter((f: any) => /(.*).schema.js$/.test(f)).map((f: any) => {
    const { default: schema } = require(f);
    typeDefs.push(schema);
  });
  ModuleFiles.filter((f: any) => /(.*).resolver.js$/.test(f)).map((f: any) => {
    const { default: resolver } = require(f);
    resolvers = merge(resolvers, resolver);
  });
  ModuleFiles.filter((f: any) => /(.*).graphql.js$/.test(f)).map((f: any) => {
    const {
      default: { resolver, schema },
    } = require(f);
    if (schema) typeDefs.push(schema);
    if (resolver) resolvers = merge(resolvers, resolver);
  });
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true,
    context: onContext,
    debug: config.util.getEnv("NODE_ENV") != "production",

    formatError(err) {
      // Logger.error()
      try {
        logger.error(err.message, {
          metadata: {
            stack: err.stack,
            name: err.name,
            message: err.message,
            extensions: err.extensions,
          },
        });
        // if (err.extensions && !err.extensions.exception.info) {
        //   ErrorHelper.logUnknowError(err);
        // }
        return err;
      } catch (error) {
        return err;
      }
    },
    subscriptions: {
      onConnect: (connectionParams, webSocket) => connectionParams,
    },
  });

  morgan.token("gql-query", (req: Request) => req.body.query);
  app.use(
    "/graphql",
    // graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    (req, res, next) => {
      if (req.body && req.body.query) {
        let minify = minifyGql(req.body.query);
        req.body.query = minify;
      }
      next();
    },
    morgan(
      ":remote-addr GRAPHQL :gql-query - :status - :response-time ms",
      // ":remote-addr :remote-user :method :url :gql-query HTTP/:http-version :status :res[content-length] - :response-time ms",
      {
        skip: (req: Request) => (get(req, "body.query") || "").includes("IntrospectionQuery"),
        stream: { write: (msg: string) => logger.info(msg.trim()) },
      }
    )
  );

  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: (origin, callback) => {
        callback(null, true);

        // const whitelist = WHITE_LIST_DOMAINS;
        // if (!origin || whitelist.findIndex((domain) => origin.startsWith(domain)) !== -1) {
        //   callback(null, true);
        // } else {
        //   callback(new Error('Not allowed by CORS'));
        // }
      },
    },
  });
  server.installSubscriptionHandlers(httpServer);

  logger.info(`Running Apollo Server on Path: http://localhost:${config.get("port")}/graphql`);
};

import { ApolloServer, gql } from "apollo-server-express";
import { Express } from "express";
import _ from "lodash";
import path from "path";
import GraphQLDateTime from "graphql-type-datetime";
import morgan from "morgan";

import { Server } from "http";
import minifyGql from "minify-graphql-loader";
import { configs } from "../configs";
import { onContext } from "./context";
import { UtilsHelper, ErrorHelper } from "../helpers";
import { Logger } from "../loaders/logger";
import { Request } from "../base/baseRoute";
import { graphqlUploadExpress } from "graphql-upload";
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
  let defaultFragment: any = {};

  const ModuleFiles = UtilsHelper.walkSyncFiles(path.join(__dirname, "modules"));
  ModuleFiles.filter((f: any) => /(.*).schema.js$/.test(f)).map((f: any) => {
    const { default: schema } = require(f);
    typeDefs.push(schema);
  });
  ModuleFiles.filter((f: any) => /(.*).resolver.js$/.test(f)).map((f: any) => {
    const { default: resolver } = require(f);
    resolvers = _.merge(resolvers, resolver);
  });
  ModuleFiles.filter((f: any) => /(.*).fragment.js$/.test(f)).map((f: any) => {
    const { default: fragment } = require(f);
    defaultFragment = _.merge(defaultFragment, fragment);
  });
  ModuleFiles.filter((f: any) => /(.*).graphql.js$/.test(f)).map((f: any) => {
    const {
      default: { resolver, schema },
    } = require(f);
    if (schema) typeDefs.push(schema);
    if (resolver) resolvers = _.merge(resolvers, resolver);
  });
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    introspection: true,
    context: onContext,
    debug: configs.debug,

    formatError(err) {
      // Logger.error()
      try {
        Logger.error(err.message, {
          metadata: {
            stack: err.stack,
            name: err.name,
            message: err.message,
            extensions: err.extensions,
          },
        });
        if (err.extensions && !err.extensions.exception.info) {
          ErrorHelper.logUnknowError(err);
        }
      } catch (error) {
        return err;
      }
    },
    subscriptions: {
      onConnect: (connectionParams, webSocket) => connectionParams,
    },
  });

  const defaultFragmentFields = Object.keys(defaultFragment);
  morgan.token("gql-query", (req: Request) => req.body.query);
  app.use(
    "/graphql",
    // graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    (req, res, next) => {
      if (req.body && req.body.query) {
        let minify = minifyGql(req.body.query);
        for (const field of defaultFragmentFields) {
          minify = minify.replace(
            new RegExp(field + "( |})", "g"),
            field + defaultFragment[field] + "$1"
          );
        }
        req.body.query = minify;
      }
      next();
    },
    morgan(
      ":remote-addr :remote-user :method :url :gql-query HTTP/:http-version :status :res[content-length] - :response-time ms",
      { skip: (req: Request) => (_.get(req, "body.query") || "").includes("IntrospectionQuery") }
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

  console.log(`\n Running Apollo Server on Path: ${configs.domain}${server.graphqlPath}`);
};

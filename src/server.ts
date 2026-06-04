#!/usr/bin/env node

import http from "http";
import debug from "debug";

import app from "./app";
import { logger } from "./utils";
const log = debug("doujin-api:server");

function normalizePort(val: string | number) {
  const port = typeof val === "string" ? parseInt(val, 10) : val;

  if (Number.isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
  logger.info(`Listening on ${bind}`);
}

const port = normalizePort(process.env.PORT || "3000");

if (port === false) {
  throw new Error("Invalid port configuration");
}

const listenPort = typeof port === "string" ? parseInt(port, 10) : port;

app.set("port", port);

const server = http.createServer(app);

server.listen(listenPort, "0.0.0.0");
server.on("error", onError);
server.on("listening", onListening);

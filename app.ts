import createError from "http-errors";
import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import logger from "morgan";

import "./db";
import { configCreation } from "./utils";
import indexRouter from "./routes/index";
import archivesRouter from "./routes/archives";
import collectionsRouter from "./routes/collections";
import historyRouter from "./routes/history";
import publicRouter from "./routes/public";
import tagsRouter from "./routes/tags";
import usersRouter from "./routes/users";
import { seeds } from "./db-utils";

var app = express();
configCreation();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// NOTE: Add middleware that needs to run before requests accessing static content here
app.use("/", publicRouter);
///////////////////////////////////////////////////////////////////////////////////////
app.use("/", express.static("public"));
///////////////////////////////////////////////////////////////////////////////////////

app.use("/", indexRouter);
app.use("/collections", collectionsRouter);
app.use("/archives", archivesRouter);
app.use("/history", historyRouter);
app.use("/tags", tagsRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// @ts-ignore | error handler
app.use(function (err, req, res, _next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Add init table data
seeds.seedUsers();

module.exports = app;

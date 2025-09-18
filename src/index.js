// Import required modules
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const globalErrorHandler = require("./utils/errorHandler");

const app = express();

// Middleware for parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

app.use("/api/v1", routes);
app.use(globalErrorHandler);

module.exports = app;

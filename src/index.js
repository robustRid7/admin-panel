// Import required modules
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const globalErrorHandler = require("./utils/errorHandler");
// const { errorHandler } = require("../shared/utils/asyncHandler");

const app = express();

// Middleware for parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// // CORS setup
// const whitelist = [
//   "http://localhost:4200",
//   "http://localhost:8080",
//   "http://localhost:50962",
//   "http://172.105.62.75",
// ];
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || whitelist.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };
app.use(cors({ origin: "*", credentials: true }));

// Routes
app.use("/api/v1", routes);
app.use(globalErrorHandler);
// // Error handler
// app.use(errorHandler);

module.exports = app;

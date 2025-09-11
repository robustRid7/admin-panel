class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // to distinguish known errors

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

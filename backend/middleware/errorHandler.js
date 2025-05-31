const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let error = {
    success: false,
    message: err.message || "Internal Server Error",
    status: err.status || 500,
  };

  // File system errors
  if (err.code === "ENOENT") {
    error = {
      success: false,
      message: "File not found",
      status: 404,
    };
  }

  res.status(error.status).json({
    success: error.success,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFound,
};

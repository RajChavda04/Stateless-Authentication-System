const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${status} - ${message}`);
  console.error(err.stack);

  res.status(status).json({
    success: false,
    message,
    status,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;

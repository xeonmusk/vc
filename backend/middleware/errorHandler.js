const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      type: 'ValidationError',
      message: err.message,
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // JWT authentication error
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      type: 'UnauthorizedError',
      message: 'Invalid token'
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      type: 'DuplicateError',
      message: 'Duplicate entry found',
      field: Object.keys(err.keyValue)[0]
    });
  }

  // MongoDB connection error
  if (err.name === 'MongoError') {
    return res.status(503).json({
      type: 'DatabaseError',
      message: 'Database operation failed'
    });
  }

  // Default server error
  return res.status(500).json({
    type: 'ServerError',
    message: 'Something went wrong!',
    errorId: Date.now()
  });
};

module.exports = errorHandler;

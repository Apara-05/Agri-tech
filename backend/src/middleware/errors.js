
export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  if (process.env.NODE_ENV !== 'production') console.error(err);
  let message = err.message || 'Server error';
  if (err.name === 'ValidationError') return res.status(400).json({ message, details: Object.values(err.errors).map(e => e.message) });
  if (err.code === 11000) return res.status(409).json({ message: 'A record with this value already exists' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid resource identifier' });
  res.status(status).json({ message: status === 500 && process.env.NODE_ENV === 'production' ? 'Internal server error' : message });
}

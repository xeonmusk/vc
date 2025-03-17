const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = `__express__${req.originalUrl}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      res.json(cachedResponse);
      return;
    }

    res.originalJson = res.json;
    res.json = (body) => {
      res.originalJson(body);
      cache.set(key, body, duration);
    };
    next();
  };
};

module.exports = cacheMiddleware;

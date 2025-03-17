const checkRole = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient role' });
      }
      next();
    };
  };
  
  module.exports = checkRole;
  
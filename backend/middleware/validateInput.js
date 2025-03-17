const Joi = require('joi');

const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin')
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateOrder = (req, res, next) => {
  const schema = Joi.object({
    orderType: Joi.string().valid('wholesale', 'retail').required(),
    items: Joi.array().items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(0).required()
      })
    ).required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateInventory = (req, res, next) => {
  const schema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().min(0).required(),
    category: Joi.string().valid('live_chicken', 'eggs', 'feed', 'medicine').required(),
    minimumThreshold: Joi.number().min(0),
    healthStatus: Joi.string().valid('healthy', 'sick', 'quarantine'),
    cost: Joi.number().min(0)
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateTask = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    assignedTo: Joi.string().required(),
    priority: Joi.string().valid('low', 'medium', 'high').required(),
    dueDate: Joi.date().min('now'),
    category: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = {
  validateRegister,
  validateOrder,
  validateInventory,
  validateTask
};

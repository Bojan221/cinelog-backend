const registerSchema = require("../schemas/register.schema");
const loginSchema = require('../schemas/login.schema');

function validateRegister(req, res, next) {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json(err);
  }
}

function validateLogin(req, res, next) {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json(err);
  }
}

module.exports = { validateRegister, validateLogin };

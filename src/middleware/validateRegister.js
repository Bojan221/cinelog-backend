const registerSchema = require('../schemas/register.schema')

function validateRegister(req,res,next) { 
    try {
        registerSchema.parse(req.body);
        next()
    } catch (err) { 
        return res.status(400).json(err)
    }
}

module.exports = validateRegister;
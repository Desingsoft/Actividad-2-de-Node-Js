const express = require('express');
const router = express.Router();
const { registrar, login }= require('./../controllers/auth.controller')
const {registerValidator,loginValidator} = require('./../validators/auth.validator')
const validator = require ('./../middlewares/validate.middleware')


router.post('/registrar',registerValidator,validator, registrar)
router.post('/login',loginValidator, validator, login) 

module.exports = router
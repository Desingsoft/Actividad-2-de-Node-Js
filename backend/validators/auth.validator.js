const { body } = require ('express-validator')

const registerValidator = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debes enviar un email válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        .isStrongPassword().withMessage('La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un símbolo'),
    body('edad')
        .optional()
        .isInt({ min: 0 }).withMessage('La edad debe ser un número positivo'),
    body('sexo')
        .optional()
        .isIn(['masculino', 'femenino', 'otro']).withMessage('El sexo no es válido'),
    body('birthday')
        .optional()
        .isDate().withMessage('La fecha de nacimiento no es válida'),
]

const loginValidator = [
    body('email')
        .notEmpty().withMessage('El email es obligatorio') 
        .isEmail().withMessage('Debes enviar un email válido'),


module.exports = { registerValidator }
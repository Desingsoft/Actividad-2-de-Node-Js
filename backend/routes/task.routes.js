const express = require('express')
const router = express.Router()

const { crearTarea, traerTareas, traerTareaporId, actualizarTarea, eliminarTarea } = require('./../controllers/task.controller')
const validarToken = require('./../middlewares/auth.middleware')

router.post('/', validarToken, crearTarea)
router.get('/', validarToken, traerTareas)
router.get('/:id', validarToken, traerTareaporId)
router.put('/:id', validarToken, actualizarTarea)
router.delete('/:id', validarToken, eliminarTarea)
module.exports = router; 
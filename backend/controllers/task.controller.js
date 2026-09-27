const Task = require('./../models/Task')
const crearTarea = async (peticion, respuesta) => {
    try {
        const task = new Task({
            titulo: peticion.body.titulo,
            usuario: peticion.user.id,
            descripcion: peticion.body.descripcion
        })
        
        await task.save()

        return respuesta.status(201).json({
          task
        })

    } catch (error) {
        return respuesta.status(500).json({
            msg: `Hubo un error creando la tarea error: ${error.message}`
        })
    }


}

const traerTareas = async (peticion, respuesta) => {
    try {
        const tasks = await Task.find({ 
            usuario: peticion.user.id 
        })

        return respuesta.status(200).json(
            tasks
        )

    } catch (error) {
        return respuesta.status(500).json({
            msg: `Hubo un error trayendo las tareas error: ${error.message}`
        })
    }

} 

const traerTareaporId = async (peticion, respuesta) => {
    try {
        const task = await Task.findOne({
            _id: peticion.params.id,
            usuario: peticion.user.id
        })

       return respuesta.status(200).json(task)
       

    } catch (error) {
        return respuesta.status(500).json({
            msg: `Hubo un error trayendo la tarea id: ${error.message}`
        })
    }

} 

const actualizarTarea = async (peticion, respuesta) => {
    try {
        const task = await Task.findByIdAndUpdate(
            peticion.params.id,
            peticion.body,
            { new: true }
        )

        return respuesta.status(200).json({task})


    } catch (error) {
        return respuesta.status(500).json({
            msg: `Hubo un error actualizando la tarea : ${error.message}`
        })
    }



}

const eliminarTarea = async (peticion, respuesta) => {
   
try {

    await Task.findByIdAndDelete(peticion.params.id)

    return respuesta.status(200).json({
        msg: 'Tarea eliminada correctamente'
    })  

    } catch (error) {
        return respuesta.status(500).json({
            msg: `Hubo un error eliminando la tarea : ${error.message}`
        })
    }



}
module.exports = {
    crearTarea, 
    traerTareas, 
    traerTareaporId, 
    actualizarTarea, 
    eliminarTarea
}
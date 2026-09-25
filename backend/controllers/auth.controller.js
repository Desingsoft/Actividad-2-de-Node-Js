

const registrar = async (peticion, respuesta) => {
   try {
    const nombre = peticion.body.nombre
    const email = peticion.body.email
    const password = peticion.body.password
    const edad = peticion.body.edad
    const sexo = peticion.body.sexo
    const birthday = peticion.body.birthday

} catch (error) {
    respuesta.status(500).json({ 
        error: `Hubo un error registrando el usuario error: ${ error.message }` 
    
        })

    }

}

module.exports = registrar 
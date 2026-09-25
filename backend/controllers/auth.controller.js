const User = require('./../models/User')

const registrar = async (peticion, respuesta) => {
   try {
    const nombre = peticion.body.nombre
    const email = peticion.body.email
    const password = peticion.body.password
    const edad = peticion.body.edad
    const sexo = peticion.body.sexo
    const birthday = peticion.body.birthday

    let user = User.findOne({ email: email })

    if (user) return respuesta.status(400).json({
        msg: 'El usuario ya existe en la base de datos'
    }) 

        let Usuario = new User({
        nombre: nombre,
        email: email,
        password: password,
        edad: edad,
        sexo: sexo,
        birthday: birthday
    })

    await user.save()

    return respuesta.status(201).json({
        message: 'Usuario creado y registrado correctamente'
    })

} catch (error) {
    return respuesta.status(500).json({ 
        error: `Hubo un error registrando el usuario error: ${ error.message }` 
    
        })

    }

}

module.exports = registrar 
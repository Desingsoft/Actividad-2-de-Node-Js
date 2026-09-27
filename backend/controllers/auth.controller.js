const User = require('./../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registrar = async (peticion, respuesta) => {
   try {
    // const nombre = peticion.body.nombre
    // const email = peticion.body.email
    // const password = peticion.body.password
    // const edad = peticion.body.edad
    // const sexo = peticion.body.sexo
    // const birthday = peticion.body.birthday 

    const { nombre, email, password, edad, sexo, birthday } = peticion.body

    let user = await User.findOne({ email: email })

    if (user) return respuesta.status(400).json({
        msg: 'El usuario ya existe en la base de datos'
    }) 

    const hashearpassword = await bcrypt.hash(password,10)
   

        user = new User({
        nombre: nombre,
        email: email,
        password: hashearpassword,
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

const login = async (peticion, respuesta) => {
    try {
        const { email, password } = peticion.body
        const user = await User.findOne({ email: email })

        if (!user) return respuesta.status(404).json({
            msg: 'El usuario no existe en la base de datos'
        })

        const PasswordsCoinciden = await bcrypt.compare(password, user.password)

        if (!PasswordsCoinciden) return respuesta.status(401).json({
            msg: 'La contraseña es incorrecta'
        })

        const token = jwt.sign(
            {id: user._id}, 
            proccess.env.SECRET_KEY,
            {expiresIn: '1h'}   
        )

        return respuesta.status(200).json({
            msg: 'Usuario logeado correctamente',
            token
        })


    } catch (error) {
        return respuesta.status(500).json({
            error: `Hubo un error logeando el usuario error: ${ error.message }`
        })
        
    }
}

 module.exports = { registrar, login }
const jwt = require('jsonwebtoken')

module.exports = (peticion, respuesta, next) => {
   
    try {

    const headerAutorization = peticion.header('Authorization')
    const token = headerAutorization.split(' ')[1]
    
    if(!token){
        return respuesta.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        peticion.user = decoded
        next()
    } catch (error) {
        return respuesta.status(500).json({
            msg: `Token no valido: ${error.message}`
        })
    }
}
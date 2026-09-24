const moongoose = require('mongoose')

const dbConnection = async () => {
    try {
        await moongoose.connect(process.env.MONGO_URI)
        console.log('Conectado correctamente a la base de datos')

    } catch (error) {
        console.error (`Hubo un error conectandose a la base de datos error: ${ error.message }`)
    }

}

module.exports = dbConnection
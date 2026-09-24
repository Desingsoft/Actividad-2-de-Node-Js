const express = require('express')
const app = express()
const moongoose = require('mongoose')
const dotenv = require('dotenv')


dotenv.config()

const dbConnection = async () => {
    try {
        await moongoose.connect('mongodb://127.0.0.1:27017/todo')
        console.log('Conectado correctamente a la base de datos')

    } catch (error) {
        console.error (`Hubo un error conectandose a la base de datos error: ${ error.message }`)
    }

}

    dbConnection()

const PORT = process.env.PORT

app.listen(PORT, () => {
    try {
        console.log(`Conectado correctamente a Node en el puerto: ${PORT}`)
    } catch (error) { 
        console.log(`Hubo un error conectandose a Node error: ${ error.message }`)

    }
  
})
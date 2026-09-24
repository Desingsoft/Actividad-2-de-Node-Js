const express = require('express')
const app = express()
const dotenv = require('dotenv')


dotenv.config()

const dbConnection = require('./config/db') 
dbConnection()

app.use(express.json())

const controlador = () => {
    console.log('Controlador funcionando correctamente desde postman')
}

app.use('/api/auth', controlador)

const PORT = process.env.PORT

app.listen(PORT, () => {
    try {
        console.log(`Conectado correctamente a Node en el puerto: ${PORT}`)
    } catch (error) { 
        console.log(`Hubo un error conectandose a Node error: ${ error.message }`)

    }
  
})
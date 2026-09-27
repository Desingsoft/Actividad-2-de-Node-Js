const express = require('express')
const app = express()
const dotenv = require('dotenv')
const auth = require('./routes/auth.routes')
const task = require('./routes/task.routes')

dotenv.config()

const dbConnection = require('./config/db') 
dbConnection()

app.use(express.json())

app.use('/api/auth', auth)
app.use('/api/task', task)

const PORT = process.env.PORT

app.listen(PORT, () => {
    try {
        console.log(`Conectado correctamente a Node en el puerto: ${PORT}`)
    } catch (error) { 
        console.log(`Hubo un error conectandose a Node error: ${ error.message }`)

    }
  
})
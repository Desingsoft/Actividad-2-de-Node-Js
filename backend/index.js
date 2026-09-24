const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT

app.listen(PORT, () => {
    try {
        console.log(`Conectado correctamente a Node en el puerto: ${PORT}`)
    } catch (error) { 
        console.log(`Hubo un error conectandose a Node error: ${ error.message }`)

    }
  
})
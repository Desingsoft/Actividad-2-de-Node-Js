const moongoose = require('mongoose');

const UsusarioSchema = new moongoose.Schema ({
    nombre: {
        type: String,
        required: true
    }, 

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    edad: {
        type: Number,
        required: true
    }, 
    
    sexo: {
        type: String,
        required: true
    }, 

    birthday: {
        type: Date,
        required: true
    }

})

module.exports = moongoose.model('Usuario', UsusarioSchema) 
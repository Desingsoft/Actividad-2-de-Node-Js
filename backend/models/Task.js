const moongoose = require('mongoose')
const taskSchema = new moongoose.Schema({
    titulo : {
        type: String,
        required: true, 
        unique: true
    }, 
    completado : {
        type: Boolean,
        default: false 
    }, 
    descricion : {
        type: String,
        default: ''
    }, 
    usuario : {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'User'
    }   

})

module.exports = moongoose.model('Task', taskSchema)
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema
const usuariosSchema = new Schema
(
    {
        nombre:
        {
            type:String,
            required:true
        },
        CC:
        {
            type: Number,
            required:true,
            unique: true
        },
        correo:
        {
            type: String,
            require:true
        },
        contrasena:
        {
            type:String,
            require:true
        },
        tipo:
        {
            type:String,
            enum: ["Aspirante","Coordinador"],
            default:"Aspirante"
        }
    }
)

usuariosSchema.plugin(uniqueValidator)

const Usuario = mongoose.model('Usuario', usuariosSchema)

module.exports = Usuario
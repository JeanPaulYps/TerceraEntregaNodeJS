const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema
const cursoSchema = new Schema
(
    {
        nombre:
        {
            type:String,
            required: true
        },
        ID: 
        {
            type: Number,
            required: true,
            unique: true
        },
        valor:
        {
            type: Number,
            required: true
        },
        descripcion:
        {
            type:String,
            required: true
        },
        modalidad:
        {
            type: String,
            enum: ["Presencial","Virtual"],
            required: true
        },
        intensidad:
        {
            type: Number,
            required: true
        },
        estado:
        {
            type: Boolean,
            require: true,
            default: true
        }, 
        matriculas: [{type: Schema.Types.ObjectId, ref: 'Usuario'}]

    }
)

cursoSchema.plugin(uniqueValidator)

const Curso = mongoose.model('Curso', cursoSchema)

module.exports = Curso
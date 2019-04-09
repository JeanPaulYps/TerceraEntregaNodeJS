const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema
const matriculaSchema = new Schema (
    {
        cursoID: 
        {
            type: Number,
            required: true
        },
        usuarioCC:
        {
            type: Number,
            required:true
        }
    }
)
matriculaSchema.plugin(uniqueValidator)
matriculaSchema.index({cursoID: 1, usuarioCC: 1},{unique: true})

const Matricula = mongoose.model('Matricula', matriculaSchema)

module.exports = Matricula
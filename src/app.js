//Importando las librerias
require('./config')
require("./helpers")
const crud = require('./crud')
var express = require('express')
var app = express()
const path = require("path")
const hbs = require("hbs")
const mongoose = require('mongoose');
const Curso = require("./modelos/cursos")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: false}))

 
//Configuracion HBS
const directorioVistas = path.join(__dirname, "../plantillas/views")
const directorioPartials = path.join(__dirname, "../plantillas/partials")
const dirPublic = path.join(__dirname, "../public")
app.use(express.static(dirPublic))
app.use(express.static(directorioVistas))
app.set('views', directorioVistas)
hbs.registerPartials(directorioPartials)
app.set('view engine', 'hbs')


//Rutas del programa

app.get('/', (req,res) => {res.render("main") })

app.get('/crear', (req,res) => {res.render("crear") })

app.get('/verCursos',crud.verCursos)

app.post('/creacionCurso', crud.crearCurso)

app.get('/verCurso/:id', crud.verCurso)


//Verificacion de conexiones

app.listen(process.env.PORT, () => {
    console.log ('servidor en el puerto ' + process.env.PORT)
})

mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err) => {
	if (err){
		return console.log("error")
	}
	console.log("conectado")
})

//"C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath="C:\data\db"
//Importando las librerias
require('./config')
require("./helpers")
const crud = require('./crud')
var express = require('express')
var app = express()
const path = require("path")
const hbs = require("hbs")
const mongoose = require('mongoose')
const Curso = require("./modelos/cursos")
const Usuario = require("./modelos/usuarios")
const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken')
const middleware = require("./middleware")
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


//Usar las cookies
if (typeof localStorage === "undefined" || localStorage === null) {
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('./scratch');
}

//Rutas del programa

app.get('/', (req,res) => {res.render("main") })

app.get('/crear', (req,res) => {res.render("crear") })

app.get('/verCursos',crud.verCursos)

app.post('/creacionCurso', crud.crearCurso)

app.get('/verCurso/:id', crud.verCurso)

app.get('/registro', (req,res)=>
{
	res.render("registro")
})
app.post('/registro', (req,res)=>
{
	datos = req.body
	let aspirante = new Usuario({
		nombre: datos.nombre,
		correo: datos.correo,
		CC: datos.CC,
		password: datos.password
	}) 
	aspirante.save((err)=>
	{
		if (err) return res.render("mensaje", {mensaje: "OTRO USUARIO YA HA SIDO CREADO CON ESE DOCUMENTO DE IDENTIDAD"})
		return res.render("mensaje", {mensaje: "Usuario creado con exito"})
	})
})

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

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
const bcrypt = require('bcrypt')
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

//Middleware
app.use(middleware.hayUsuario)

//Rutas del programa

app.get('/',(req,res) => 
{	
	res.locals.titulo = "Bienvenido"
	res.render("main") 
})


app.get('/crear', middleware.esCoordinador, (req,res) => {
	res.locals.titulo = "Crear"
	res.render("crear") 
})

app.post('/creacionCurso', middleware.esCoordinador, crud.crearCurso)


app.get('/verCursos',crud.verCursos)

app.get('/verCurso/:id', crud.verCurso)


app.get('/registro',middleware.siHayUsuarioDetener, (req,res)=> {
	res.render("registro", {titulo: "Registro"})
})

app.post('/registro',  crud.crearUsuario)


app.get('/ingresar', middleware.siHayUsuarioDetener, (req,res)=> {
	res.render("ingresar", {titulo: "Ingresar"})
})

app.post('/ingresar', (req,res)=>
{
	datos = req.body
	Usuario.findOne({CC: datos.CC}, (err,resultado)=>
	{
		
		if (err) return res.render("mensaje", {mensaje: "error"})
		if (!resultado) return res.render("mensaje", { mensaje: "Error en credenciales", titulo: "Error"})
		if (!bcrypt.compareSync(datos.contrasena, resultado.contrasena))
			return res.render("mensaje", {mensaje: "Error en credenciales", titulo: "Error"})
		
		let token = jwt.sign(
			{usuario: resultado}, '@FzKFc!p@a4uH7$t', {expiresIn: '12h'}
		)
		localStorage.setItem('token', token)
		res.redirect("/")
	})
})


app.get('/salir', (req,res)=>
{
	localStorage.setItem('token','')
	res.redirect("/")
})


app.get('/inscripcion/:id', middleware.esAspirante, crud.matricularUsuario)


app.get('/registroCoord',middleware.siHayUsuarioDetener, (req,res)=>
{
	res.locals.titulo = "Registro Coordinador"
	res.render("registroCoord")
})

app.post('/registroCoord',crud.registroCoordinador )


app.get("/verInscritos",middleware.esCoordinador, crud.verMatriculas)


app.post("/eliminarMatricula",middleware.esCoordinador,crud.eliminarMatriculas)


app.get("/cerrarCurso/:id", crud.cerrarCurso)

app.get('*',(req,res)=> {
	res.render('mensaje', {
		mensaje: "No existe direccion",titulo: "Error",		
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

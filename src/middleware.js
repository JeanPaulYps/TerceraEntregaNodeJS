const jwt = require('jsonwebtoken');
const Curso = require("./modelos/cursos")
const Usuario = require("./modelos/usuarios")

if (typeof localStorage === "undefined" || localStorage === null) {
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('./scratch');
}

const middlewares = 
{
    hayUsuario: function (req,res,next)
    {
        let token = localStorage.getItem('token')
	    res.locals.sesion = false
        jwt.verify(token, '@FzKFc!p@a4uH7$t', (err, decoded) => 
        {
            if (err) {
                return next();
            }
            console.log(decoded)
            //req.usuario = decoded.usuario;
            //console.log(req.usuario)
            res.locals.sesion = true
            //res.locals.nombre = req.usuario.nombre
            next();
        }
        )
    }, esCoordinador: function(req,res,next)
    {
        let token = localStorage.getItem('token')
        jwt.verify(token, '@FzKFc!p@a4uH7$t', (err, decoded) =>
        {
            if (err)
                return res.render("mensaje", {mensaje: "ERROR"})
            if(decoded.usuario.tipo.localeCompare("Coordinador"))
                return res.render("mensaje", {mensaje: "No tiene permisos"})
            next()
            
        }
            
        )
    }, esAspirante: function(req,res,next)
    {
        let token = localStorage.getItem('token')
        jwt.verify(token, '@FzKFc!p@a4uH7$t', (err, decoded) =>
        {
            if (err)
                return res.render("mensaje", {mensaje: "No ha ingresado"})
            if(decoded.usuario.tipo.localeCompare("Aspirante"))
                return res.render("mensaje", {mensaje: "No tiene permisos"})
            next()
            
        }
        )
          
    }

}
module.exports = middlewares
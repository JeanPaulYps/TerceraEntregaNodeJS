const Curso = require("./modelos/cursos")
const Usuario = require("./modelos/usuarios")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const crud = 
{
    crearCurso: function (req,res)
    {
        res.locals.titulo = "Crear Curso"
        datos = req.body
        let curso = new Curso({
            nombre: datos.nombre,
            ID: datos.ID,
            modalidad: datos.modalidad,
            valor: datos.valor,
            descripcion: datos.descripcion,
            intensidad: datos.intensidad,
        })
        curso.save((err) =>
        {
            if (err) return res.render("mensaje", {mensaje: "OTRO CURSO YA HA SIDO CREADO CON ESE ID"})
            return  res.render("mensaje", {mensaje: "Curso creado exitosamente"})
        })
    },
    verCursos: function(req,res) 
    {
        res.locals.titulo = "Ver Cursos"
        Curso.find({}, (err, respuesta) =>
        {
            if (err) return res.render("mensaje", {mensaje: "ERROR"})
            res.render("verCursos",{cursos: respuesta})
        }) 
       
    },
    verCurso: function(req,res)
    {
        id = req.params.id
        Curso.findOne({ID : id}, (err,resultado)=>
        {
            if (err) return res.render("mensaje", {mensaje: "error", titulo: "ERROR"})
            if (!resultado) return res.render("mensaje", {mensaje: "No existe curso", titulo: "ERROR"})
            return res.render('verCurso', {curso: resultado, titulo: resultado.nombre })
        })
    },
    crearUsuario: function (req,res)
    {
        datos = req.body
        let aspirante = new Usuario({
            nombre: datos.nombre,
            correo: datos.correo,
            CC: datos.CC,
            telefono: datos.telefono,
            contrasena: bcrypt.hashSync(datos.contrasena,10)
        }) 
        aspirante.save((err)=>
        {
            if (err) return res.render("mensaje", {mensaje: "OTRO USUARIO YA HA SIDO CREADO CON ESE DOCUMENTO DE IDENTIDAD", titulo: "ERROR"})
            return res.render("mensaje", {mensaje: "Usuario creado con exito", titulo: "Exito"})
        })
    },
    matricularUsuario: function (req,res)
    {
        ID = req.params.id
        let token = localStorage.getItem('token')
        jwt.verify(token, '@FzKFc!p@a4uH7$t', (error, decoded) => 
        {
            usuarioCC = decoded.usuario.CC
            Curso.findOne({"ID": ID, "matriculas": decoded.usuario._id}, (err,resultado) => {
                if (resultado)
                    return res.render("mensaje", {mensaje: "¡ERROR!, YA SE HA CREADO UNA MATRICULA SIMILAR", titulo: "ERROR"})
                Curso.findOneAndUpdate({"ID": ID}, {"$push":{"matriculas": decoded.usuario}}, (e,r) =>{
                    return res.render("mensaje", {mensaje: "Se ha creado matricula con exito", titulo: "Matricula exitosa"})
                } )
                
            })
        })
    }, registroCoordinador: function (req,res)
    {
        datos = req.body
        let aspirante = new Usuario({
            nombre: datos.nombre,
            correo: datos.correo,
            CC: datos.CC,
            contrasena: bcrypt.hashSync(datos.contrasena,10),
            telefono: datos.telefono,
            tipo: "Coordinador"
        }) 
        aspirante.save((err)=>
        {
            if (err) return res.render("mensaje", {mensaje: "OTRO USUARIO YA HA SIDO CREADO CON ESE DOCUMENTO DE IDENTIDAD"})
            return res.render("mensaje", {mensaje: "Usuario creado con exito"})
        })
    }, verMatriculas: function (req,res)
    {
        res.locals.titulo = "Ver inscritos"
        Curso.find({"estado": true}, (err, cursos)=>
        {
            Usuario.populate(cursos,{path: "matriculas"}, (err,respuesta)=>
            {
                res.locals.cursos = respuesta
                return res.render("verInscritos")
            })
        })
        
    }, eliminarMatriculas: function (req,res)
    {
        ID = req.body.cursoID
        usuarioID= req.body.usuarioID
        Curso.updateOne({"ID": ID}, {"$pull":{"matriculas": usuarioID}} , (e,r) =>{
            return res.redirect("/verInscritos")
        })
    }, cerrarCurso: function (req,res)
    {
        ID = req.params.id
        Curso.updateOne({"ID": ID}, {"estado": false}, (e,r)=>{
            res.redirect("/verCursos")
        })
    }
    
}

module.exports = crud
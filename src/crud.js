const Curso = require("./modelos/cursos")
const Usuario = require("./modelos/usuarios")
const bcrypt = require('bcrypt');

const crud = 
{
    crearCurso: function (req,res)
    {
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
        Curso.find({}, (err, respuesta) =>
        {
            if (err) return console.log(err)
            res.render("verCursos",{cursos: respuesta})
        }) 
       
    },
    verCurso: function(req,res)
    {
        id = req.params.id
        Curso.findOne({ID : id}, (err,resultado)=>
        {
            console.log(resultado)
            if (err) return res.render("mensaje", {mensaje: "error"})
            if (!resultado) return res.render("mensaje", {mensaje: "No existe curso"})
            return res.render('verCurso', {curso: resultado})
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
            if (err) return res.render("mensaje", {mensaje: "OTRO USUARIO YA HA SIDO CREADO CON ESE DOCUMENTO DE IDENTIDAD"})
            return res.render("mensaje", {mensaje: "Usuario creado con exito"})
        })
    }
    
}

module.exports = crud
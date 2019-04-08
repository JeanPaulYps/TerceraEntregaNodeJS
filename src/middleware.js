const jwt = require('jsonwebtoken');
const middlewares = 
{
    estaloggeado: function (req, res,next)
    {
        let token = localStorage.getItem('token')
        jwt.verify(token, 'virtual-tdea', (err, decoded) =>
        {
            if (err) 
                return res.render("mensaje", {mensaje: "error"})
            req.usuario = decoded.usuario;
            console.log(req.usuario)
            res.locals.sesion = true
            res.locals.nombre = req.usuario.nombre
            next()
        })
    }
}
module.exports = middlewares
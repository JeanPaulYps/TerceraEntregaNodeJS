const hbs = require("hbs")

hbs.registerHelper('ListarCursos', (cursos) => 
{
    console.log(cursos)
    return JSON.stringify(cursos)
}
)
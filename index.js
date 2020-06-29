//Aca debo codear todo mi software server
const express = require('express')
const multer = require('multer')
const joi = require("@hapi/joi");
const server = express()


const public = express.static('public')
const json = express.json();
const urlencode = express.urlencoded({ extended: true })
const upload = multer()

const schema = joi.object({
  nombre: joi.string().alphanum().min(3).max(25).required(),
  correo: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } })
    .required(),
  asunto: joi
    .string()
    .alphanum()
    .valid("ax14", "ax38", "ax45", "ax67")
    .required(),
  mensaje: joi.string().alphanum().min(10).max(100).required(),
});

server.use(json)
server.use(urlencode);
server.use(upload.array())
server.use( public ) //<--- middleware software que esta en medio de la petición http- y la respuesta del servidor esa petición-

server.post('/enviar', (req, res) => {
    
    //const datos = req.body
    const datos = {
        nombre: 'Luis Miguel',
        correo: 'roberto@ojedaweb.com',
        asunto: 'ax45',
        mensaje: 'Este es la consulta 5678 del pedido 8900'
    }
    console.log('Estos son los datos enviados.')
    console.log( datos )
    const validacion = schema.validate( datos )

    if (validacion.error) {
        res.json({ rta: 'Error!'})
    
    } else {
    
        res.json({ rta: "OK" });
        
    }

})


server.listen(3000)


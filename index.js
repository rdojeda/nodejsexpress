//Aca debo codear todo mi software server
require('dotenv').config()

const express = require('express')
const multer = require('multer')
const joi = require("@hapi/joi");
const nodemailer = require('nodemailer')
const server = express()


const public = express.static('public')
const json = express.json();
const urlencode = express.urlencoded({
    extended: true
})
const upload = multer()

const schema = joi.object({
    nombre: joi.string().min(3).max(25).required(),
    correo: joi.string()
        .email({
            minDomainSegments: 2,
            tlds: {
                allow: ["com", "net", "org"]
            }
        })
        .required(),
    asunto: joi.string()
        .valid("ax14", "ax38", "ax45", "ax67")
        .required(),
    mensaje: joi.string().min(10).max(100).required(),
});

//NODEMAILER
//Paso 1 - Crear la conexión con el servidor de email (ethereal)
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

//Paso 2 - Verificar la conexión con el servidor de email
transporter.verify((error, ok) => {
    error ? console.log('Error verificar') : console.log('Envio exitoso')
})

server.use(json)
server.use(urlencode);
server.use(upload.array())
server.use(public) //<--- middleware software que esta en medio de la petición http- y la respuesta del servidor esa petición-

server.post('/enviar', (req, res) => {

    const datos = req.body // ya viene el objeto en json

    console.log('Estos son los datos enviados.')
    console.log(datos)
    const validacion = schema.validate(datos)

    if (validacion.error) {
        res.json({
            rta: 'Error!',
            details: validacion.error.details
        })

    } else {
        // Si los datos son validos hacer magia
        //Paso 3- Aca se envia el email   
        transporter.sendMail({
            from: datos.correo,
            to: 'ojeda.robertodaniel@gmail.com',
            replyTo: datos.correo, 
            subject: 'Consulta desde Node',
            html: `
                    <h2 style="color:grey">Datos del Contacto</h2>
                    <p>Nombre : ${datos.nombre}</p>
                    <p>Email: ${datos.correo}</p>
                    <p>Mensaje:</p>
                    <blockquote> ${datos.mensaje} </blockquote>

            `
        }, (error, info) => {
            const rta = error ? 'Su consulta no pudo ser enviada' : 'Gracias por su consulta! :D'
            res.json({
                rta
            });

        })

    }
})

server.listen(5000)

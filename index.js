//Aca debo codear todo mi software server
const express = require('express')
const server = express()

const public = express.static('public')
const urlencode = express.urlencoded({ extended: false })
const json = express.json()

server.use( public ) //<--- middleware software que esta en medio de la petición http- y la respuesta del servidor esa petición-
server.use( urlencode )
server.use( json )

server.post('/enviar', (req, res) => {
    
    const datos = req.body
    console.log('Estos son los datos enviados.')
    console.log(datos)
    
    res.json({ rta: 'OK'})
})


server.listen(3000)


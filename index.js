//Aca debo codear todo mi software server
const express = require('express')
const server = express()

const public = express.static('public')

server.use( public )
    
server.post('/enviar', (req, res) =>{
    res.send('<h1>Hello Form</h1>')
})


server.listen(3000)


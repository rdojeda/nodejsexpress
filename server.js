const express = require('express')
const server = express()

const urlencoded = express.urlencoded({ extended: true })
const json = express.json()

const DB = []

console.log( DB )

server.use( json )
server.use( urlencoded )
server.listen( 5000 )

server.get('/api', (req, res) => { // Obtener los datos
    res.json( DB )
}) 

server.post('/api', (req, res) => {  // Crear con datos
    /*Requisitos el id 
        único
        irrepetible
        Autoasignable
    */



    const datos = req.body
    //faltan las validaciones 
    const id = new Date().getTime()

    DB.push({ id, ...datos })
    console.log( DB )
    res.json({ rta : 'OK creando datos POST' })
})
server.put('/api', (req, res) => { // Actualizar con datos 
    const datos = req.body

    const encontrado =   DB.find(producto => producto.id == datos.id )
    encontrado.stock = datos.stock

    res.json({  rta : 'OK actualizado el producto' })
}) 
    
server.delete('/api', (req, res) => { // Eliminar los datos
    res.json({  rta : 'OK eliminado el producto'  })
}) 

const express = require('express')
const { MongoClient }  = require('mongodb')
const server = express()

const urlencoded = express.urlencoded({ extended: true })
const json = express.json()


//mongodb+srv://Dbojedaweb:rdo0j3d6@cluster0.xqb2m.mongodb.net/Cluster0?retryWrites=true&w=majority
//en Robo 3T create conexión en Name MongoDb Atlas address cargar  cluster0.xqb2m.mongodb.net mantener port 27017

//MongoClient.paraHacerCosasLocas()

const url = ` mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_BASE}?retryWrites=true&w=majority`;

let DB = null
    
MongoClient.connect(url, { useUnifiedTopology: true }, function (
  error,
  client
) {
  DB = client.db("MercadoTech");
});
console.log('El servidor de MongoDB es:')
console.log( process.env.MONGO_DB_HOST )

server.use( json )
server.use( urlencoded )
server.listen( 5000 )

server.get('/api', (req, res) => { // Obtener los datos
    
    res.json( DB.collection('Productos').find({}).toArray() )
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


const express = require('express')
const { MongoClient }  = require('mongodb')
const server = express()

const urlencoded = express.urlencoded({ extended: true })
const json = express.json()


//mongodb+srv://Dbojedaweb:rdo0j3d6@cluster0.xqb2m.mongodb.net/Cluster0?retryWrites=true&w=majority
//en Robo 3T create conexión en Name MongoDb Atlas address cargar  cluster0.xqb2m.mongodb.net mantener port 27017

//MongoClient.paraHacerCosasLocas()

const url = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_BASE}?retryWrites=true&w=majority`;

const connectDb = async () => {

    const client = await MongoClient.connect(url, { useUnifiedTopology: true })
    
    DB = await client.db('MercadoTech')
}


let DB = null

connectDb()


console.log('El servidor de MongoDB es:')
console.log( process.env.MONGO_DB_HOST )

server.use( json )
server.use( urlencoded )
server.listen( 5000 )

server.get('/api', async (req, res) => { // Obtener los datos
    
    const productos = await DB.collection('Productos')
    const resultado = await productos.find({}).toArray()

    res.json( resultado )
}) 

server.post('/api', async (req, res) => {  // Crear con datos
    /*Requisitos el id 
        único
        irrepetible
        Autoasignable
    */

    const datos = req.body
    //aca van las validaciones 
    const productos = await DB.collection('Productos')
    
    const { result }= await productos.insertOne(datos)
    
    res.json({ rta : result.ok })
})

server.get('/api/:id', async (req, res) => {
    res.end(`El producto a buscar por id es: ${req.params.id} `)    
})

server.put('/api', async (req, res) => { // Actualizar con datos 
    const datos = req.body

    const encontrado =   DB.find(producto => producto.id == datos.id )
    encontrado.stock = datos.stock

    res.json({  rta : 'OK actualizado el producto' })
}) 
    
server.delete('/api', async (req, res) => { // Eliminar los datos
    res.json({  rta : 'OK eliminado el producto'  })
}) 


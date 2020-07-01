const express = require('express')
const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb')
const server = express()

const urlencoded = express.urlencoded({ extended: true })
const json = express.json()


//en Robo 3T create conexión en Name MongoDb Atlas address cargar  cluster0.xqb2m.mongodb.net mantener port 27017

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
    const productos = await DB.collection('Productos')
    const ID = req.params.id

    const query = { '_id': ObjectId(ID) }

    const resultado = await productos.find( query ).toArray()
    
    
    res.json( resultado )    
})

server.put('/api/:id', async (req, res) => { // Actualizar con datos 
    const ID = req.params.id 
    const datos = req.body 
    
    const productos = await DB.collection('Productos')

    const query = { '_id': ObjectId(ID) }
    
    const update = {
        $set: { ...datos }
    }

    const { result } = await productos.updateOne( query, update )
  
    res.json({  rta : result.ok })
}) 


server.delete('/api/:id', async (req, res) => { // Eliminar los datos

     const ID = req.params.id;
         
     const productos = await DB.collection('Productos')

    const query = { '_id' : ObjectId(ID)}
    
    const result = await productos.findOneAndDelete(query);

    res.json({ rta: result.ok })
}) 


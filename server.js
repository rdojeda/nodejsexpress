const express = require('express')
const hbs = require('express-handlebars')
const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const server = express()

const urlencoded = express.urlencoded({ extended: true })
const json = express.json()
const public = express.static(__dirname + '/public')

//en Robo 3T create conexión en Name MongoDb Atlas address cargar  cluster0.xqb2m.mongodb.net mantener port 27017

const url = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_BASE}?retryWrites=true&w=majority`;

const connectDb = async () => {

    const client = await MongoClient.connect(url, { useUnifiedTopology: true })
    
  // DB = await client.db('MercadoTech')
    return DB = await client.db('MercadoTech')
}

const port = 4000

//let DB = null

//connectDb()


console.log('El servidor de MongoDB es:')
console.log( process.env.MONGO_DB_HOST )

server.use( json )
server.use(urlencoded)
server.set('view engine', 'handlebars')
server.engine('handlebars', hbs() )

server.use('/', public )
server.listen( port )

//Inicio rutas del Dashboard
server.get('/admin', async (req, res) => {
    const DB = await connectDb() 

    const productos = await DB.collection('Productos')
    const resultado = await productos.find({}).toArray()
    
    console.log('Los productos son:')
    console.log( resultado )
    res.render('main', { layout : false, items : resultado, url : req.protocol + '://' + req.hostname + ':' + port }) //<--- http://localhost:4000
    
})

/// Dashboard


server.get('/admin/nuevo', (req, res) => {
    
    res.end('Aca hay que crear un nuevo producto')


})

server.get('/admin/editar/:id', (req, res) => {

    res.end('Aca hay que editar un producto')


})

server.get('/admin/ingresar', (req, res) => {

    res.render('login', {layout: false})
})

server.get('/admin/:id', async (req, res) => {
    
    res.end(`Acá se va a editar el producto : ${req.params.id}`)
})

//Fin de rutas del Dashboard


server.get('/api', async (req, res) => { // Obtener los datos
    const DB = await connectDb()
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
    const DB = await connectDb()
    const datos = req.body
    //aca van las validaciones 
    const productos = await DB.collection('Productos')
    
    const { result }= await productos.insertOne(datos)
    
    res.json({ rta : result.ok })
})

server.get('/api/:id', async (req, res) => {
    const DB = await connectDb()
    const productos = await DB.collection('Productos')
    const ID = req.params.id

    const query = { '_id': ObjectId(ID) }

    const resultado = await productos.find( query ).toArray()
    
    
    res.json( resultado )    
})

server.put('/api/:id', async (req, res) => { // Actualizar con datos 
    const DB = await connectDb()
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
    const DB = await connectDb()
     const ID = req.params.id;
         
     const productos = await DB.collection('Productos')

    const query = { '_id' : ObjectId(ID)}
    
    const result = await productos.findOneAndDelete(query);

    res.json({ rta: result.ok })
}) 

//////////JWT Test

const verifyToken = (req, res, next) => {
    //aca hay que verificar el token
    const token = req.query.token
    jwt.verify(token, process.env.JWT_PASSPHRASE, (error, data) => { 
        if(error) {
            res.json({ rta: 'Acceso no autorizado'})  
        } else {
            req.user = data.usuario
            next()
        }
    })
    

}

server.post('/login', (req, res) => {

    const datos = req.body

    if( datos.email == "pepito@gmail.com" && datos.clave == 'pepito') {
        
        const token = jwt.sign({ usuario: datos.email, expiresIn: 60}, process.env.JWT_PASSPHRASE)
        
        res.json({ rta: 'Estas logueado', token })
 
    } else {
        res.json({ rta: 'Datos Incorrectos'})
    }

})

server.get('/check', verifyToken, (req, res) => {
    //aca voy a decir si el token es valido  o no
    
    res.end(`Bienvenido "${req.user}"`)
})


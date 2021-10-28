const express =require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors=require('cors')
const app =express()

const port =5000;
// middleware 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jwphj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("tourismSport");
      const testCollection = database.collection("services");
     
      
    //   get api 
    app.get('/services',async(req,res)=>{
        const cursor = testCollection.find({});
        const servertest=await cursor.toArray();
        res.send(servertest)
    })
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);
  app.get('/',(req,res)=>{
    res.send('welcome to torism webserver')
})
app.listen(port,()=>{
    console.log('server port',port)
})

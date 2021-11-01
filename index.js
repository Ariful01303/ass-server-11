const express =require('express')
const { MongoClient, LEGAL_TCP_SOCKET_OPTIONS } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors=require('cors')
const app =express()

// const port = process.env.PORT || 5000;
const port=process.env.PORT || 5000;
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
      const bookingCollection = client.db("tourSpot").collection("booking");
      const myaddCollection = client.db("myadd").collection("addservice");
      const clintCollection = client.db("happyClint").collection("clients");
     
      
    //   get api 
    app.get('/services',async(req,res)=>{
        const cursor = testCollection.find({});
        const servertest=await cursor.toArray();
        res.send(servertest)
    })
    // post api
    app.post('/services', async (req, res) => {
        const service = req.body;
        console.log('hit the post api', service);

        const result = await testCollection.insertOne(service);
        console.log(result);
        res.json(result)
    });
    // get clients api
    app.get('/clients', async (req, res) => {
      const cursor = clintCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
  });
    // app.get('/addservice',async(req,res)=>{
    //     const cursor = myaddCollection.find({});
    //     const addserver=await cursor.toArray();
    //     res.send(addserver)
    // })
    // // add data 
    // app.post('/addservice', async (req, res) => {
    //     console.log(req.body);
    //     const result = await myaddCollection.insertOne(req.body);
    //    res.json(result)
    //     console.log(result);
    //   });
   
   
     
      // Add booking 
    app.post('/booking',(req,res)=>{
        bookingCollection.insertOne(req.body).then((result) => {
            res.send(result);
          });
    })
      // get all booking by email query
  app.get("/booking/:email", (req, res) => {
    console.log(req.params);
    bookingCollection
      .find({ email: req.params.email })
      .toArray((err, results) => {
        res.send(results);
      });
  });
//   delete 
  app.delete("/booking/:id", async(req, res) => {
     
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await bookingCollection.deleteOne(query);
    res.json(result);
})
 
    }
     finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);
  app.get('/',(req,res)=>{
    res.send('welcome to torism webserver')
});
app.listen(port,()=>{
    console.log('server port',port)
})

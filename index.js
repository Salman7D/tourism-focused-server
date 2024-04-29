const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rd2qmai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const touristsSpotCollection = client.db("spotDB").collection("spot");

    app.get("/touristsSpot", async(req, res) => {
        const cursor = touristsSpotCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get("/touristsSpot/:id", async(req, res) => {
        const id = req.params.id;
        const query = {
            _id: new ObjectId(id)
        }
        const result = await touristsSpotCollection.findOne(query)
        res.send(result);
    })

    app.get("/myProduct/:email", async(req, res) => {
        console.log(req.params.email);
        const result = await touristsSpotCollection.find({email: req.params.email}).toArray();
        res.send(result);
    })

    app.get("/myAddedLists/:email", async(req, res) => {
        console.log(req.params.email);
        const result = await touristsSpotCollection.find({email: req.params.email}).toArray();
        res.send(result);
    })

    app.get("/singleProduct/:id", async(req, res) => {
        const result = await touristsSpotCollection.findOne({_id: new ObjectId(req.params.id)})
        res.send(result);
    })

    app.post("/touristsSpot", async(req, res) => {
        const newTouristsSpot = req.body;
        console.log(newTouristsSpot);
        const result = await touristsSpotCollection.insertOne(newTouristsSpot);
        res.send(result);
    })

    app.put("/updateProduct/:id", async(req, res) => {
           console.log(req.params.id);
        
        const query = {
            _id: new ObjectId(req.params.id)
        }

        const data = {
            $set: {
                spot_name: req.body.spot_name, 
                country_Name: req.body.country_Name, 
                location: req.body.location, 
                description: req.body.description, 
                average_cost: req.body.average_cost, 
                seasonality: req.body.seasonality, 
                travel_time: req.body.travel_time,
                totalVisitors: req.body.totalVisitors,
                photo: req.body.photo
            }
        }

        const result = await touristsSpotCollection.updateOne(query, data);
        res.send(result);
    })


    app.delete("/delete/:id", async(req, res) => {
        const id = req.params.id;
        const query = {
            _id: new ObjectId(id)
        }
        const result = await touristsSpotCollection.deleteOne(query);
        res.send(result);
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/", (req, res) => {
    res.send("tourism server is running")
})

app.listen(port, () => {
    console.log(`tourism server is running on port: ${port}`);
})
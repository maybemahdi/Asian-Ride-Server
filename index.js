const express = require("express");
const cors = require("cors");
// const countries = require("./country.json");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrdgddr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const allSpotCollection = client.db("allSpot").collection("spots");
    const allCountryCollection = client.db("allSpot").collection("countries");

    // crud for country
    app.get("/countries", async(req, res) => {
      const cursor = allCountryCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    //crud for spots
    app.get("/allspot", async (req, res) => {
      const cursor = allSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/allspot/:id", async (req, res) => {
      const id = req.params.id;
      const spot = await allSpotCollection.findOne({ _id: new ObjectId(id) });
      res.send(spot);
    });
    app.post("/allspot", async (req, res) => {
      const spot = req.body;
      const result = await allSpotCollection.insertOne(spot);
      res.send(result);
    });
    app.put("/allspot/:id", async (req, res) => {
      const id = req.params.id;
      const updatedSpot = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateSpot = {
        $set: {
          spotName: updatedSpot.spotName,
          photo: updatedSpot.photo,
          country: updatedSpot.country,
          location: updatedSpot.location,
          description: updatedSpot.description,
          cost: updatedSpot.cost,
          season: updatedSpot.season,
          time: updatedSpot.time,
          visitors: updatedSpot.visitors,
        },
      };
      const result = await allSpotCollection.updateOne(
        filter,
        updateSpot,
        options
      );
      res.send(result);
    });
    app.delete("/allspot/:id", async (req, res) => {
      const id = req.params.id;
      const result = await allSpotCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Asian Ride is running");
});

app.listen(port, () => {
  console.log(`Asian Ride server is running on port ${port}`);
});

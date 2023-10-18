const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

//  MONGODB DATABASE USER PASSWORD

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.udorxk7.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    await client.connect();

    // const productCollection = client
    //   .db("productCollection")
    //   .collection("products");


    //post operation
    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await client
      .db("productCollection")
      .collection(`${product.brand}`).insertOne(product);
      console.log(result);
      res.send(result);
    });

    // get operation

    app.get("/products", async (req, res) => {
      
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
  res.send("Crud is running...");
});

app.listen(port, () => {
  console.log(`Crud is Running on port ${port}`);
});

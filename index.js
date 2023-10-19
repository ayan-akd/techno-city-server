const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

//  MONGODB DATABASE USER PASSWORD

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.udorxk7.mongodb.net/?retryWrites=true&w=majority`;

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

    const productsCollection = client.db("productsDB").collection("products");
    const cartCollection = client.db("productsDB").collection("myCart");

    // get operation

    app.get("/products", async (req, res) => {
      const products = productsCollection.find();
      const result = await products.toArray();
      res.send(result);
    });

    app.get("/products/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/products/:brand/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    //cart section

    app.get("/cart", async (req, res) => {
      const cart = cartCollection.find();
      const result = await cart.toArray();
      res.send(result);
    });

    //post operation
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    //cart section

    app.post("/cart", async (req, res) => {
      const newCartItem = req.body;
      const result = await cartCollection.insertOne(newCartItem);
      res.send(result);
    });

    //delete operation

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    //update operation

    app.put("/products/:brand/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedProduct = {
        $set: {
          name: data.name,
          brand: data.brand,
          category: data.category,
          price: data.price,
          details: data.details,
          rating: data.rating,
          photo: data.photo,
        }
      }
      const result = await productsCollection.updateOne(filter, updatedProduct);
      res.send(result);
    });

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
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});

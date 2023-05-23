const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://lutfarrahmaninfo:lutfarrahmaninfo@cluster0.cqzv9i7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("assignment11");
    const toysCollection = database.collection("toy");
    const cartCollection = database.collection("cart");
    //toys collections
    app.post("/alltoys", async (req, res) => {
      const newToy = req.body;
      const result = await toysCollection.insertOne(newToy);
      res.json(result);
    });

    // PUT route to update a toy
    app.put("/alltoys/:id", async (req, res) => {
      const toyId = req.params.id;
      const updatedToy = req.body;

      try {
        const result = await toysCollection.updateOne(
          { _id: new ObjectId(toyId) },
          { $set: updatedToy }
        );

        if (result.modifiedCount > 0) {
          res.json({ message: "Toy updated successfully" });
        } else {
          res.status(404).json({ error: "Toy not found" });
        }
      } catch (error) {
        console.log("Error updating toy:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // DELETE route to delete a toy
    app.delete("/alltoys/:id", async (req, res) => {
      const toyId = req.params.id;
      try {
        const result = await toysCollection.deleteOne({
          _id: new ObjectId(toyId),
        });
        if (result.deletedCount > 0) {
          res.json({ success: true, message: "Toy deleted successfully" });
        } else {
          res.json({ success: false, message: "Toy not found" });
        }
      } catch (error) {
        console.log("Error deleting toy:", error);
        res
          .status(500)
          .json({ success: false, error: "Internal server error" });
      }
    });

    app.get("/alltoys", async (req, res) => {
      let result = await toysCollection.find().toArray();
      res.json(result);
    });

    app.get("/alltoys/:id", async (req, res) => {
      const productId = req.params.id;
      const result = await toysCollection.findOne({
        _id: new ObjectId(productId),
      });
      res.json(result);
      // console.log(result);
    });

    app.post("/cart", async (req, res) => {
      const newToy = req.body;
      const result = await cartCollection.insertOne(newToy);
      res.json(result);
    });
    // PUT route to update a toy
    app.put("/cart/:id", async (req, res) => {
      const toyId = req.params.id;
      const updatedToy = req.body;

      try {
        const result = await cartCollection.updateOne(
          { _id: new ObjectId(toyId) },
          { $set: updatedToy }
        );

        if (result.modifiedCount > 0) {
          res.json({ message: "Toy updated successfully" });
        } else {
          res.status(404).json({ error: "Toy not found" });
        }
      } catch (error) {
        console.log("Error updating toy:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // DELETE route to delete a toy
    app.delete("/cart/:id", async (req, res) => {
      const toyId = req.params.id;
      try {
        const result = await cartCollection.deleteOne({
          _id: new ObjectId(toyId),
        });
        if (result.deletedCount > 0) {
          res.json({ success: true, message: "Toy deleted successfully" });
        } else {
          res.json({ success: false, message: "Toy not found" });
        }
      } catch (error) {
        console.log("Error deleting toy:", error);
        res
          .status(500)
          .json({ success: false, error: "Internal server error" });
      }
    });

    app.get("/cart", async (req, res) => {
      let result = await cartCollection.find().toArray();
      res.json(result);
    });

    app.get("/cart/:email", async (req, res) => {
      const productEmail = req.params.email;
      const result = await cartCollection
        .find({ userEmail: productEmail })
        .toArray();
      console.log(result);
      res.json(result);
      console.log(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`${port} Port is running`);
});

import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all products
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("products");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving products");
  }
});

// Get a single product by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("products");
    let query = { _id: ObjectId(req.params.id) }; // Convert to ObjectId
    let result = await collection.findOne(query);

    if (!result) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving product" });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  try {
    let newProduct = {
      name: req.body.name,
      category: req.body.category,
      sub_category: req.body.sub_category,
      price: req.body.price,
      stock: req.body.stock,
      status: req.body.status,
      description: req.body.description,
      images: req.body.images,
      colors: req.body.colors,
      dimensions: req.body.dimensions,
      material: req.body.material,
      tags: req.body.tags,
    };
    let collection = await db.collection("products");
    let result = await collection.insertOne(newProduct);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding product");
  }
});

// Update a product by id
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }; // Use 'new' here
    const updates = {
      $set: {
        name: req.body.name,
        category: req.body.category,
        sub_category: req.body.sub_category,
        price: req.body.price,
        stock: req.body.stock,
        status: req.body.status,
        description: req.body.description,
        images: req.body.images,
        colors: req.body.colors,
        dimensions: req.body.dimensions,
        material: req.body.material,
        tags: req.body.tags,
      },
    };

    let collection = await db.collection("products");
    let result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating product" });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }; // Ensure you're using new ObjectId
    const collection = db.collection("products");
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).send({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product");
  }
});

export default router;

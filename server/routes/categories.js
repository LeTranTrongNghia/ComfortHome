import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all categories
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("categories");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving categories");
  }
});

// Get a single category by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("categories");
    let query = { _id: req.params.id }; // Assuming _id is a string
    let result = await collection.findOne(query);

    if (!result) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving category" });
  }
});

// Create a new category
router.post("/", async (req, res) => {
  try {
    let newCategory = {
      name: req.body.name,
      sub_categories: req.body.sub_categories,
    };
    let collection = await db.collection("categories");
    let result = await collection.insertOne(newCategory);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding category");
  }
});

// Update a category by id
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: req.params.id }; // Assuming _id is a string
    const updates = {
      $set: {
        name: req.body.name,
        sub_categories: req.body.sub_categories,
      },
    };

    let collection = await db.collection("categories");
    let result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating category" });
  }
});

// Delete a category
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: req.params.id }; // Assuming _id is a string

    const collection = db.collection("categories");
    let result = await collection.deleteOne(query);

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting category");
  }
});

export default router;

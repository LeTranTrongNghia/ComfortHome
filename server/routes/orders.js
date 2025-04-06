import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all orders
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("orders");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving orders");
  }
});

// Get a single order by id
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("orders");
    let query = { _id: new ObjectId(req.params.id) }; // Assuming _id is an ObjectId
    let result = await collection.findOne(query);

    if (!result) {
      res.status(404).json({ error: "Order not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving order" });
  }
});

// Create a new order
router.post("/", async (req, res) => {
  try {
    let newOrder = {
      userId: req.body.userId, // Should be a valid user ID from the users collection
      status: req.body.status,
      totalPrice: req.body.totalPrice,
      paymentMethod: req.body.paymentMethod,
      createdAt: req.body.createdAt || new Date().toISOString(),
      items: req.body.items, // Array of items with productId, quantity, and price
    };
    let collection = await db.collection("orders");
    let result = await collection.insertOne(newOrder);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding order");
  }
});

// Update an order by id
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }; // Assuming _id is an ObjectId
    const updates = {
      $set: {
        userId: req.body.userId,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        paymentMethod: req.body.paymentMethod,
        createdAt: req.body.createdAt,
        items: req.body.items,
      },
    };

    let collection = await db.collection("orders");
    let result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      res.status(404).json({ error: "Order not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating order" });
  }
});

// Delete an order
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) }; // Assuming _id is an ObjectId

    const collection = db.collection("orders");
    let result = await collection.deleteOne(query);

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting order");
  }
});

export default router;

import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all users
router.get("/", async (req, res) => {
    try {
        let collection = await db.collection("users");
        let results = await collection.find({}).toArray();
        res.status(200).send(results);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving users");
    }
});

// Get a single user by id
router.get("/:id", async (req, res) => {
    try {
        let collection = await db.collection("users");
        let query = { _id: new ObjectId(req.params.id) };
        let result = await collection.findOne(query);

        if (!result) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json(result);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving user" });
    }
});

// Create a new user
router.post("/", async (req, res) => {
    try {
        let newUser = {
            fullName: req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            deliveryAddress: req.body.deliveryAddress,
            password: req.body.password,
            role: req.body.role,
            productsCart: req.body.productsCart || [],
        };
        let collection = await db.collection("users");
        let result = await collection.insertOne(newUser);
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding user");
    }
});

// Update a user by id
router.patch("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const updates = {
            $set: {
                productsCart: req.body.productsCart // This will replace the entire array
            },
        };

        let collection = await db.collection("users");
        let result = await collection.updateOne(query, updates);

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating user" });
    }
});

// Delete a user
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };

        const collection = db.collection("users");
        let result = await collection.deleteOne(query);

        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting user");
    }
});

export default router;

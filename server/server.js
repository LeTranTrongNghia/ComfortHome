import express from "express";
import cors from "cors";
import categoriesRouter from "./routes/categories.js"; 
import productsRouter from "./routes/products.js";
import usersRouter from "./routes/users.js";
import ordersRouter from "./routes/orders.js";

const PORT = process.env.PORT || 5050;
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Add detailed error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Routes
app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

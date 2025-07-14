import express from "express";
import dotenv from "dotenv";
import { initDB } from "./db/db.js";
import { createTransaction, deleteTransactionById, getSummaryByUserId, getTransactionByUserId } from "./controller/transaction-controller.js";
import { rateLimiter } from "./middleware/RateLimiter.js";
import transactionRoutes from "./routes/transactions.routes.js";
dotenv.config();

const app = express();


// middleware
app.use(rateLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const PORT = process.env.PORT || 5001;

//routes
app.use("/api",transactionRoutes)


initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
  });
});
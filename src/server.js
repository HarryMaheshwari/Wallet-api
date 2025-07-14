import express from "express";
import dotenv from "dotenv";
import { initDB } from "./db/db.js";
import { createTransaction, deleteTransactionById, getSummaryByUserId, getTransactionByUserId } from "./controller/transaction-controller.js";
import { rateLimiter } from "./middleware/RateLimiter.js";
import transactionRoutes from "./routes/transactions.routes.js";
import job from "./config/cron.js";
dotenv.config();

const app = express();

if(process.env.NODE_ENV == "production")  job.start(); // start the cron job only in production


// middleware
app.use(rateLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const PORT = process.env.PORT || 5001;


app.use("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

//routes
app.use("/transactions",transactionRoutes)


initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
  });
});
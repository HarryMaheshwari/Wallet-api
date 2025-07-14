import Router from "express";
import { createTransaction, deleteTransactionById, getSummaryByUserId, getTransactionByUserId } from "../controller/transaction-controller.js";
const router = Router();

router.post("/transactions", createTransaction);
router.get("/transactions/:userId", getTransactionByUserId);
router.delete("/transactions/delete/:transactionId", deleteTransactionById);
router.get("/transactions/summary/:userId", getSummaryByUserId); 

export default router;
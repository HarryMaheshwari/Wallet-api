import Router from "express";
import { createTransaction, deleteTransactionById, getSummaryByUserId, getTransactionByUserId } from "../controller/transaction-controller.js";
const router = Router();

router.post("/create", createTransaction);
router.get("/get-transactions/:userId", getTransactionByUserId);
router.delete("/delete/:transactionId", deleteTransactionById);
router.get("/summary/:userId", getSummaryByUserId); 

export default router;
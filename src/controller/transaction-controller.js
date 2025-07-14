import { sql } from "../db/db.js";

export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
      INSERT INTO transactions(user_id,title,amount,category)
      VALUES (${user_id},${title},${amount},${category})
      RETURNING * 
    `; // Using RETURNING * - to get the inserted transaction

    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTransactionByUserId(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const transactions = await sql`
      SELECT * FROM transactions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions by user ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTransactionById(req, res) {
  try {
    const { transactionId } = req.params;

    if (isNaN(parseInt(transactionId))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const deletedTransaction = await sql`
      DELETE FROM transactions
      WHERE id = ${transactionId}
      RETURNING *
    `;

    if (deletedTransaction.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
    `

    const incomeResult = await sql`
    SELECT COALESCE(SUM(amount), 0) AS income 
    FROM transactions 
    WHERE user_id = ${userId} 
    AND amount > 0
    `

    const expenseResult = await sql`
    SELECT COALESCE(SUM(amount), 0) AS expense
    FROM transactions 
    WHERE user_id = ${userId}  
    AND amount < 0
    `
    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense
    });

  } catch (error) {
    console.error("Error deleting the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

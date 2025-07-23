import { Request, Response } from "express";
import { sql } from "../config/constants.js";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required " });
    }

    const transaction = await sql`
        INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *
      `;

    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getUserTransactions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const transaction = await sql`
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
      `;

    res.status(200).json(transaction);
  } catch (error) {
    console.log("Error creating transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const deleteTransactionById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        if(isNaN(parseInt(id))) {
            return res.status(400).json({message: "Invalid Transaction Id"})
        }
        
        const transaction = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`

        if(transaction.length === 0) {
            return res.status(400).json({message: "Transaction not found"})
        }

        res.status(200).json({message: "Transaction deleted successfully"})

    } catch (error) {
        console.log("Error deleting transaction", error);
    res.status(500).json({ message: "Internal server error" });
    }
}


export const getUserAccountSummary = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
      `;

    const incomeResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
    ` 

    const expensesResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
    ` 

    res.status(200).json({
        balance: balanceResult[0].balance,
        income: incomeResult[0].income,
        expense: expensesResult[0].expenses
    });
  } catch (error) {
    console.log("Error getting the summary", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
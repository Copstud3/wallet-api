import express, { Router } from 'express';
import { createTransaction, deleteTransactionById, getUserAccountSummary, getUserTransactions } from '../controllers/transactions.controller.js';

const router: Router = express.Router();

router.post("/", createTransaction);

router.get("/:userId", getUserTransactions);

router.delete("/:id", deleteTransactionById)

router.get("/summary/:userId", getUserAccountSummary);


export default router;
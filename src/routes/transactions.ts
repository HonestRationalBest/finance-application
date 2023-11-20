import { Router, Request, Response } from 'express';
import { Income } from '../models/Income';
import { Expense } from '../models/Expense';
import { asyncErrorHandling } from '../middlewares/asyncErrorHandling';

const router = Router();

router.get('/user/:userId', asyncErrorHandling(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const incomes = await Income.findAll({ where: { userId } });
  const expenses = await Expense.findAll({ where: { userId } });

  const transactions = {
    incomes,
    expenses
  };

  res.json(transactions);
}));

export default router;

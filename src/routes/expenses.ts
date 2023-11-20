import { Router, Request, Response } from "express";

import { Expense } from "../models/Expense";
import { asyncErrorHandling } from "../middlewares/asyncErrorHandling";
import { ExpenseCategory } from "../models/ExpenseCategory";

const router = Router();

const updateExpenseCategorySum = async (categoryId: number, amount: number) => {
  const category = await ExpenseCategory.findByPk(categoryId);
  if (category) {
    category.sum = category.sum + amount;
    await category.save();
  }
};

router.post(
  "/",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const { amount, expenseCategoryId } = req.body;
    const expense = await Expense.create(req.body);
    await updateExpenseCategorySum(expenseCategoryId, amount);
    res.status(201).json(expense);
  })
);

router.get(
  "/",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const expenses = await Expense.findAll();
    res.json(expenses);
  })
);

router.get(
  "/:id",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const expense = await Expense.findByPk(req.params.id);
    if (expense) {
      res.json(expense);
    } else {
      res.status(404).json({ error: "Expense not found" });
    }
  })
);

router.put(
  "/:id",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    const amountDifference = req.body.amount - expense.amount;

    await expense.update(req.body);

    if (amountDifference !== 0) {
      await updateExpenseCategorySum(
        expense.expenseCategoryId,
        amountDifference
      );
    }

    res.json(expense);
  })
);

router.delete(
  "/:id",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    await updateExpenseCategorySum(expense.expenseCategoryId, -expense.amount);

    await expense.destroy();
    res.status(204).send();
  })
);

export default router;

import { Router, Request, Response } from "express";

import { Expense } from "../models/Expense";
import { asyncErrorHandling } from "../middlewares/asyncErrorHandling";
import { ExpenseCategory } from "../models/ExpenseCategory";
import { authenticateToken } from "../middlewares/authenticateToken";

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
  authenticateToken,
  asyncErrorHandling(async (req: Request, res: Response) => {
    const { amount, expenseCategoryId } = req.body;
    const expense = await Expense.create(req.body);
    await updateExpenseCategorySum(expenseCategoryId, amount);
    res.status(201).json(expense);
  })
);

router.get(
  "/",
  authenticateToken,
  asyncErrorHandling(async (req: Request, res: Response) => {
    const expenses = await Expense.findAll();
    res.json(expenses);
  })
);

router.put(
  "/:id",
  authenticateToken,
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
  authenticateToken,
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

router.get(
  "/:categoryId",
  authenticateToken,
  asyncErrorHandling(async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.categoryId);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const expenses = await Expense.findAll({
      where: { expenseCategoryId: categoryId },
    });

    console.log(categoryId);

    if (expenses.length > 0) {
      res.json(expenses);
    } else {
      res.status(404).json({ error: "No expenses found for this category" });
    }
  })
);

export default router;

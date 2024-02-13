import { Router, Request, Response } from "express";
import { Income } from "../models/Income";
import { asyncErrorHandling } from "../middlewares/asyncErrorHandling";
import { IncomeCategory } from "../models/IncomeCategory";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = Router();

const updateIncomeCategorySum = async (categoryId: number, amount: number) => {
  const category = await IncomeCategory.findByPk(categoryId);
  if (category) {
    category.sum = category.sum + amount;
    await category.save();
  }
};

router.post(
  "/",
  authenticateToken,
  asyncErrorHandling(async (req: Request, res: Response) => {
    const { amount, incomeCategoryId } = req.body;
    const income = await Income.create(req.body);
    await updateIncomeCategorySum(incomeCategoryId, amount);
    res.status(201).json(income);
  })
);

router.get(
  "/",
  authenticateToken,
  asyncErrorHandling(async (req: Request, res: Response) => {
    const incomes = await Income.findAll();
    res.json(incomes);
  })
);

router.put(
  "/:id",
  authenticateToken,
  asyncErrorHandling(async (req: Request, res: Response) => {
    const income = await Income.findByPk(req.params.id);
    if (!income) {
      return res.status(404).json({ error: "Income not found" });
    }

    const amountDifference = req.body.amount - income.amount;

    await income.update(req.body);

    if (amountDifference !== 0) {
      await updateIncomeCategorySum(income.incomeCategoryId, amountDifference);
    }

    res.json(income);
  })
);

router.delete(
  "/:id",
  authenticateToken,
  asyncErrorHandling(async (req: Request, res: Response) => {
    const income = await Income.findByPk(req.params.id);
    if (!income) {
      return res.status(404).json({ error: "Income not found" });
    }

    await updateIncomeCategorySum(income.incomeCategoryId, -income.amount);

    await income.destroy();
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

    const incomes = await Income.findAll({
      where: { incomeCategoryId: categoryId },
    });

    if (incomes) {
      res.json(incomes);
    } else {
      res.status(404).json({ error: "No incomes found for this category" });
    }
  })
);

export default router;

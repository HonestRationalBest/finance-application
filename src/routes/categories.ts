import { Router, Request, Response } from "express";
import { ExpenseCategory } from "../models/ExpenseCategory";
import { IncomeCategory } from "../models/IncomeCategory";

import { asyncErrorHandling } from "../middlewares/asyncErrorHandling";

const router = Router();

router.get(
  "/:userId",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const expenseCategories = await ExpenseCategory.findAll({
      where: { userId },
    });

    const incomeCategories = await IncomeCategory.findAll({
      where: { userId },
    });

    res.json({
      expenseCategories,
      incomeCategories,
    });
  })
);

export default router;

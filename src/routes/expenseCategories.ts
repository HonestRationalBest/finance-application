import { Router, Request, Response } from "express";

import { ExpenseCategory } from "../models/ExpenseCategory";
import { asyncErrorHandling } from "../middlewares/asyncErrorHandling";

const router = Router();

router.post(
  "/",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const expenseCategory = await ExpenseCategory.create(req.body);
    res.status(201).json(expenseCategory);
  })
);

router.get(
  "/",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const expenseCategories = await ExpenseCategory.findAll();
    res.json(expenseCategories);
  })
);

router.get(
  "/:id",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const expenseCategory = await ExpenseCategory.findByPk(req.params.id);
    if (expenseCategory) {
      res.json(expenseCategory);
    } else {
      res.status(404).json({ error: "ExpenseCategory not found" });
    }
  })
);

router.put(
  "/:id",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const expenseCategory = await ExpenseCategory.findByPk(req.params.id);
    if (expenseCategory) {
      await expenseCategory.update(req.body);
      res.json(expenseCategory);
    } else {
      res.status(404).json({ error: "ExpenseCategory not found" });
    }
  })
);

router.delete(
  "/:id",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const expenseCategory = await ExpenseCategory.findByPk(req.params.id);
    if (expenseCategory) {
      await expenseCategory.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "ExpenseCategory not found" });
    }
  })
);

export default router;

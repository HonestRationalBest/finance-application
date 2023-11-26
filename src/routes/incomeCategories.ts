import { Router, Request, Response } from "express";
import { IncomeCategory } from "../models/IncomeCategory";
import { asyncErrorHandling } from "../middlewares/asyncErrorHandling";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = Router();

router.post(
  "/",
  authenticateToken,
  asyncErrorHandling(async (req: Request, res: Response) => {
    const incomeCategory = await IncomeCategory.create(req.body);
    res.status(201).json(incomeCategory);
  })
);

router.get(
  "/",
  authenticateToken,
  asyncErrorHandling(async (req: Request, res: Response) => {
    const incomeCategories = await IncomeCategory.findAll();
    res.json(incomeCategories);
  })
);

router.get(
  "/:id",
  authenticateToken,
  asyncErrorHandling(async (req: Request, res: Response) => {
    const incomeCategory = await IncomeCategory.findByPk(req.params.id);
    if (incomeCategory) {
      res.json(incomeCategory);
    } else {
      res.status(404).json({ error: "IncomeCategory not found" });
    }
  })
);

router.put(
  "/:id",
  authenticateToken,
  asyncErrorHandling(async (req: Request, res: Response) => {
    const incomeCategory = await IncomeCategory.findByPk(req.params.id);
    if (incomeCategory) {
      await incomeCategory.update(req.body);
      res.json(incomeCategory);
    } else {
      res.status(404).json({ error: "IncomeCategory not found" });
    }
  })
);

router.delete(
  "/:id",
  authenticateToken,
  asyncErrorHandling(async (req: Request, res: Response) => {
    const incomeCategory = await IncomeCategory.findByPk(req.params.id);
    if (incomeCategory) {
      await incomeCategory.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "IncomeCategory not found" });
    }
  })
);

export default router;

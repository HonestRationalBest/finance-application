import { Router, Request, Response } from "express";
import { IncomeCategory } from "../models/IncomeCategory";
import { asyncErrorHandling } from "../middlewares/asyncErrorHandling";

const router = Router();

router.post(
  "/",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const incomeCategory = await IncomeCategory.create(req.body);
    res.status(201).json(incomeCategory);
  })
);

router.get(
  "/",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const incomeCategories = await IncomeCategory.findAll();
    res.json(incomeCategories);
  })
);

router.get(
  "/:id",
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

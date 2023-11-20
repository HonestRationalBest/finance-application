import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";

import { User } from "../models/User";
import { asyncErrorHandling } from "../middlewares/asyncErrorHandling";

const router = Router();

router.post(
  "/",
  asyncErrorHandling(async (req: Request, res: Response) => {
    let hashedPin = null;
    if (req.body.pin) {
      hashedPin = await bcrypt.hash(req.body.pin, 10);
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
      pin: hashedPin,
    });

    const { password, ...userData } = user.get({ plain: true });
    res.status(201).json(userData);
  })
);

router.get(
  "/",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  })
);

router.get(
  "/:id",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(user);
    }
  })
);

router.put(
  "/:id",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const user = await User.findByPk(req.params.id);

    if (user) {
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      if (req.body.pin) {
        req.body.pin = await bcrypt.hash(req.body.pin, 10);
      }

      await user.update(req.body);

      const { password, ...updatedUserData } = user.get({ plain: true });
      res.json(updatedUserData);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  })
);

router.delete(
  "/:id",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "User not found" });
    }
  })
);

export default router;

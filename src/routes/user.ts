import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/User";
import { asyncErrorHandling } from "../middlewares/asyncErrorHandling";
import { authenticateToken } from "../middlewares/authenticateToken";

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

router.post(
  "/login",
  asyncErrorHandling(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });
    res.json({ token, userId: user.id });
  })
);

router.get(
  "/",
  authenticateToken,
  asyncErrorHandling(async (req: Request, res: Response) => {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  })
);

router.get(
  "/:id",
  authenticateToken,
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
  authenticateToken,
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
  authenticateToken,
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

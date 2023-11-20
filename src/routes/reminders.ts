import { Router, Request, Response } from 'express';
import { Reminder } from '../models/Reminder';

import { asyncErrorHandling } from '../middlewares/asyncErrorHandling';

const router = Router();

router.post('/', asyncErrorHandling(async (req: Request, res: Response) => {
  const reminder = await Reminder.create(req.body);
  res.status(201).json(reminder);
}));

router.get('/user/:userId', asyncErrorHandling(async (req: Request, res: Response) => {
  const reminders = await Reminder.findAll({
    where: { userId: req.params.userId }
  });
  res.json(reminders);
}));

router.get('/:id', asyncErrorHandling(async (req: Request, res: Response) => {
  const reminder = await Reminder.findByPk(req.params.id);
  if (reminder) {
    res.json(reminder);
  } else {
    res.status(404).json({ error: 'Reminder not found' });
  }
}));

router.put('/:id', asyncErrorHandling(async (req: Request, res: Response) => {
  const reminder = await Reminder.findByPk(req.params.id);
  if (!reminder) {
    return res.status(404).json({ error: 'Reminder not found' });
  }

  await reminder.update(req.body);
  res.json(reminder);
}));

router.delete('/:id', asyncErrorHandling(async (req: Request, res: Response) => {
  const reminder = await Reminder.findByPk(req.params.id);
  if (!reminder) {
    return res.status(404).json({ error: 'Reminder not found' });
  }

  await reminder.destroy();
  res.status(204).send();
}));

export default router;

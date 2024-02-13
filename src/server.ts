import dotenv from "dotenv";
dotenv.config();

import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import bodyParser from "body-parser";
import cors from "cors";

import userRoutes from "./routes/user";
import incomeCategoryRoutes from "./routes/incomeCategories";
import expenseCategoryRoutes from "./routes/expenseCategories";
import incomeRoutes from "./routes/incomes";
import expenseRoutes from "./routes/expenses";
import transactionRoutes from "./routes/transactions";
import reminderRoutes from "./routes/reminders";
import categoryRoutes from './routes/categories';

import { User } from "./models/User";
import { IncomeCategory } from "./models/IncomeCategory";
import { ExpenseCategory } from "./models/ExpenseCategory";
import { Income } from "./models/Income";
import { Expense } from "./models/Expense";
import { Reminder } from "./models/Reminder";

import { sequelize } from "./config/sequelize";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());
app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
);

app.use("/users", userRoutes);
app.use("/income-categories", incomeCategoryRoutes);
app.use("/expense-categories", expenseCategoryRoutes);
app.use("/incomes", incomeRoutes);
app.use("/expenses", expenseRoutes);
app.use("/transactions", transactionRoutes);
app.use("/reminders", reminderRoutes);
app.use('/categories', categoryRoutes);

User.hasMany(IncomeCategory, { foreignKey: "userId" });
IncomeCategory.belongsTo(User, { foreignKey: "userId" });

User.hasMany(ExpenseCategory, { foreignKey: "userId" });
ExpenseCategory.belongsTo(User, { foreignKey: "userId" });

IncomeCategory.hasMany(Income, { foreignKey: "incomeCategoryId" });
ExpenseCategory.hasMany(Expense, { foreignKey: "expenseCategoryId" });

Income.belongsTo(IncomeCategory, { foreignKey: "incomeCategoryId" });
Expense.belongsTo(ExpenseCategory, { foreignKey: "expenseCategoryId" });

ExpenseCategory.hasMany(Reminder, {
  foreignKey: "expenseCategoryId",
  as: "expenseReminders",
});
Reminder.belongsTo(ExpenseCategory, {
  foreignKey: "expenseCategoryId",
  as: "expenseCategory",
});

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error("Unable to start server:", error);
  });

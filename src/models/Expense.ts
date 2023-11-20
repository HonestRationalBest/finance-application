import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
} from "sequelize-typescript";

import { User } from "./User";
import { ExpenseCategory } from "./ExpenseCategory";

@Table
export class Expense extends Model<Expense> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  amount!: number;

  @ForeignKey(() => ExpenseCategory)
  @Column
  expenseCategoryId!: number;

  @ForeignKey(() => User)
  @Column
  userId!: number;
}

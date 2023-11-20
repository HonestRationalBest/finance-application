import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

import { User } from "./User";
import { ExpenseCategory } from "./ExpenseCategory";

@Table
export class Reminder extends Model<Reminder> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  title!: string;

  @Column
  description!: string;

  @Column
  dueDate!: Date;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @ForeignKey(() => ExpenseCategory)
  @Column
  expenseCategoryId?: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
  } from 'sequelize-typescript';
  
  import { User } from './User';
  
  @Table
  export class ExpenseCategory extends Model<ExpenseCategory> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;
  
    @Column
    name!: string;
  
    @Column
    sum!: number;
  
    @ForeignKey(() => User)
    @Column
    userId!: number;
  }
  
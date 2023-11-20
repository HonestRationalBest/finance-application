import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    ForeignKey
  } from 'sequelize-typescript';
  
  import { User } from './User';
  import { IncomeCategory } from './IncomeCategory';
  
  @Table
  export class Income extends Model<Income> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;
  
    @Column
    name!: string;
  
    @Column
    amount!: number;
  
    @ForeignKey(() => IncomeCategory)
    @Column
    incomeCategoryId!: number;
  
    @ForeignKey(() => User)
    @Column
    userId!: number;
  }
  
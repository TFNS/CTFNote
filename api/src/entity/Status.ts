
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import User from "./User";
import Task from "./Task";

@Entity()
export default class Status {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  value: string;

  @ManyToOne(() => User, user => user.statuses)
  user: User;

  @ManyToOne(() => Task, task => task.statuses)
  task: Task;
}

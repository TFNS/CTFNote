import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  AfterLoad,
} from "typeorm";
import User from "./User";
import Task from "./Task";
import RightsManager from "../utils/rights";

@Entity()
export default class CTF {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { unique: true, nullable: false })
  slug: string;

  @Column("text", { nullable: false })
  title: string;

  @Column("float", { nullable: true })
  weight: number;

  @Column("text", { nullable: true })
  ctfUrl: string;

  @Column("text", { nullable: true })
  logoUrl: string;

  @Column("text", { nullable: true })
  ctfTimeUrl: string;

  @Column("text", { nullable: true })
  format: string;

  @Column("text", { nullable: true })
  description: string;

  @Column("text", { nullable: true })
  credentials: string;

  @Column("timestamp", { nullable: true })
  start: Date;

  @Column("timestamp", { nullable: true })
  finish: Date;

  @ManyToMany(() => User)
  @JoinTable()
  guests: User[];

  @OneToMany(() => Task, (task) => task.ctf)
  @JoinTable()
  tasks: Task[];

  running: boolean = false;
  granted: boolean = false;

  addGranted(user) {
    this.granted = RightsManager.isGrantedCTF(user, this);
    if (!this.granted) {
      this.credentials = null;
    }
  }

  @AfterLoad()
  setRunning() {
    const now = new Date();
    this.running = this.start < now && this.finish > now;
  }
}

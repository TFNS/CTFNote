import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { unique: true })
  key: string;

  @Column("json")
  value: any;

  @Column("boolean")
  private: boolean;
}

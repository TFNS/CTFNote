import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import Status from "./Status"


@Entity()
export default class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", { unique: true })
    slug: string;

    @Column("text")
    username: string;

    @Column("text", { select: false })
    password: string;

    @Column("text", { array: true })
    rights: string[];

    @OneToMany(() => Status, status => status.user)
    statuses: Status[];
}

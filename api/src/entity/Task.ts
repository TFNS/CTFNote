import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import CTF from "./CTF";
import User from "./User";


@Entity()
@Unique(["ctf", "slug"])
export default class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    slug: string;

    @Column("text")
    title: string;

    @Column("text", { nullable: true })
    description: string;

    @Column("text", { nullable: true })
    category: string;

    @Column("boolean", { default: false })
    solved: boolean;

    @Column("text")
    padUrl: string;

    @ManyToOne(() => CTF, ctf => ctf.tasks)
    ctf: CTF;

    @ManyToMany(() => User)
    @JoinTable()
    players: User[];
}

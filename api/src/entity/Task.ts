import { Entity, PrimaryGeneratedColumn, Column, Unique, Index, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import CTF from "./CTF";
import User from "./User";


@Entity()
// @Unique(["ctf", "slug"])
@Index(["ctf", "slug"], { unique: true })
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

    @Column("text", { default: null })
    flag: string;

    @Column("text")
    padUrl: string;

    @ManyToOne(() => CTF, ctf => ctf.tasks)
    ctf: CTF;

    @ManyToMany(() => User)
    @JoinTable()
    players: User[];
}

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity()
export default class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text", {unique: true})
    slug: string;

    @Column("text")
    username: string;

    @Column("text", {select:false})
    password: string;

    @Column("text", { array: true })
    rights: string[];

    @Column("boolean",{default:false})
    externalAuth: boolean;
}


import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export default class Session {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    userSlug: string;

    @Column("text")
    uuid: string;

    @Column("date")
    expiresAt: Date;
}

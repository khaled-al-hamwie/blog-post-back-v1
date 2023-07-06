import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn({ unsigned: true, type: "mediumint" })
    user_id: number;

    @Column({ type: "varchar", length: 45 })
    user_name: string;

    @Column({ type: "varchar", length: 20 })
    first_name: string;

    @Column({ type: "varchar", length: 20 })
    last_name: string;

    @Column({ nullable: true })
    profile: string;

    @Column({ nullable: true })
    avatar: string;
}

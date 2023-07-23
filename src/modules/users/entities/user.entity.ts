import { Role } from "src/modules/roles/entities/role.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn({ unsigned: true, type: "mediumint" })
    user_id: number;

    @Column({ type: "varchar", length: 45 })
    user_name: string;

    @Column()
    password: string;

    @Column({ type: "varchar", length: 20 })
    first_name: string;

    @Column({ type: "varchar", length: 20 })
    last_name: string;

    @Column({ nullable: true })
    profile: string;

    @Column({ nullable: true })
    avatar: string;

    @ManyToOne(() => Role, role => role.users, { nullable: false })
    @JoinColumn({ name: "role_id" })
    role: Role;
}

import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn({ unsigned: true, type: "tinyint" })
    role_id: number;

    @Column({ type: "varchar", length: 20 })
    name: string;

    @OneToMany(() => User, user => user.role)
    users: User[];
}

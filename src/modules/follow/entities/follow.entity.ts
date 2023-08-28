import { User } from "src/modules/users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Follow {
    @PrimaryGeneratedColumn({ unsigned: true, type: "int" })
    follow_id: number;

    @ManyToOne(() => User, user => user.user_id)
    @JoinColumn({ name: "follower_id" })
    follower: User;

    @ManyToOne(() => User, user => user.followers)
    @JoinColumn({ name: "user_id" })
    user: User;
}

import { Blog } from "src/modules/blogs/entities/blog.entity";
import { Like } from "src/modules/likes/entities/like.entity";
import { Role } from "src/modules/roles/entities/role.entity";
import {
    Column,
    DeleteDateColumn,
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

    @Column({ type: "varchar", length: 45, unique: true, update: false })
    user_name: string;

    @Column({ update: false, type: "varchar", length: 500 })
    password: string;

    @Column({ type: "varchar", length: 20 })
    first_name: string;

    @Column({ type: "varchar", length: 20 })
    last_name: string;

    @Column({ nullable: true, type: "varchar", length: 500 })
    profile: string;

    @Column({ nullable: true })
    avatar: string;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Role, role => role.users, { nullable: false })
    @JoinColumn({ name: "role_id" })
    role: Role;

    @OneToMany(() => Blog, blog => blog.user)
    blogs: Blog[];

    @OneToMany(() => Like, like => like.user)
    likes: Like[];
}

import { Blog } from "src/modules/blogs/entities/blog.entity";
import { User } from "src/modules/users/entities/user.entity";
import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Favorite {
    @PrimaryGeneratedColumn({ unsigned: true, type: "bigint" })
    favorite_id: number;

    @ManyToOne(() => User, user => user.favorites, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Blog, blog => blog.favorites, { nullable: false })
    @JoinColumn({ name: "blog_id" })
    blog: Blog;

    @CreateDateColumn()
    created_at: Date;
}

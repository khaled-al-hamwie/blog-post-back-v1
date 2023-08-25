import { Blog } from "src/modules/blogs/entities/blog.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Like {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    like_id: number;

    @ManyToOne(() => User, user => user.likes, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Blog, blog => blog.likes, { nullable: false })
    @JoinColumn({ name: "blog_id" })
    blog: Blog;
}

import { Blog } from "src/modules/blogs/entities/blog.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BlogLike {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    blog_like_id: number;

    @ManyToOne(() => User, user => user.blog_likes, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Blog, blog => blog.blog_likes, { nullable: false })
    @JoinColumn({ name: "blog_id" })
    blog: Blog;
}

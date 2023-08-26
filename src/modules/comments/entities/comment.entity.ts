import { Blog } from "src/modules/blogs/entities/blog.entity";
import { User } from "src/modules/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    comment_id: number;

    @Column({ type: "varchar", length: 2000 })
    comment: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => User, user => user.comments, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Blog, blog => blog.comments, { nullable: false })
    @JoinColumn({ name: "blog_id" })
    blog: Blog;
}

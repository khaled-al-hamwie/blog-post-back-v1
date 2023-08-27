import { Blog } from "src/modules/blogs/entities/blog.entity";
import { CommentLike } from "src/modules/likes/entities/comment-like.entity";
import { User } from "src/modules/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
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

    @ManyToOne(() => User, user => user.comments, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Blog, blog => blog.comments, { nullable: false })
    @JoinColumn({ name: "blog_id" })
    blog: Blog;

    @ManyToOne(() => Comment, comment => comment.replies, { nullable: true })
    @JoinColumn({ name: "reply_id" })
    parent: Comment;

    @OneToMany(() => Comment, comment => comment.parent)
    replies: Comment[];

    @OneToMany(() => CommentLike, like => like.comment)
    comment_likes: CommentLike[];
}

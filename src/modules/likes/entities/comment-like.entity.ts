import { Comment } from "src/modules/comments/entities/comment.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CommentLike {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    comment_like_id: number;

    @ManyToOne(() => User, user => user.comment_likes, { nullable: false })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => Comment, comment => comment.comment_likes, {
        nullable: false,
    })
    @JoinColumn({ name: "comment_id" })
    comment: Comment;
}

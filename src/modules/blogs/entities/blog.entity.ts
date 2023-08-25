import { Like } from "src/modules/likes/entities/like.entity";
import { User } from "src/modules/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Blog {
    @PrimaryGeneratedColumn({ unsigned: true, type: "bigint" })
    blog_id: number;

    @Column({ type: "varchar", length: 25 })
    title: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    sub_title: string;

    @Column({ type: "varchar", length: 1000, nullable: true })
    blog_pic: string;

    @Column({ type: "varchar", length: 5000 })
    document: string;

    @Column({ type: "int" })
    minute_to_read: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => User, user => user.blogs, { nullable: false })
    @JoinColumn({ name: "author_id" })
    user: User;

    @OneToMany(() => Like, like => like.blog)
    likes: Like[];
}

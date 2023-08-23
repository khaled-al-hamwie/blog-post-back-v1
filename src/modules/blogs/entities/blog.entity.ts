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
export class Blog {
    @PrimaryGeneratedColumn({ unsigned: true, type: "bigint" })
    blog_id: number;

    @Column({ type: "varchar", length: 25 })
    title: string;

    @Column({ type: "varchar", length: 45, nullable: true })
    sub_title: string;

    @Column({ type: "varchar", length: 1000 })
    blog_pic: string;

    @Column({ type: "varchar", length: 5000 })
    document: string;

    @Column({ type: "time" })
    time_to_read: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => User, user => user.blogs, { nullable: false })
    @JoinColumn({ name: "author_id" })
    user: User;
}

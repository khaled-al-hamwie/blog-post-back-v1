import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { Blog } from "../../blogs/entities/blog.entity";
import { UsersService } from "../../users/services/users.service";
import { BlogLike } from "../entities/blog-like.entity";

@Injectable()
export class BlogLikesService {
    constructor(
        @InjectRepository(BlogLike) private likeRepositry: Repository<BlogLike>,
        private readonly usersService: UsersService,
    ) {}
    async create(blog: Blog, user_id: number) {
        const like = this.likeRepositry.create();
        like.blog = blog;
        like.user = await this.usersService.findOne({
            where: {
                user_id,
            },
        });
        this.likeRepositry.save(like);
        return { message: "like has been added" };
    }

    findOne(options: FindOneOptions<BlogLike>) {
        return this.likeRepositry.findOne(options);
    }

    async isLiked(blog_id: number, user_id: number): Promise<boolean> {
        return (await this.findOne({
            where: { blog: { blog_id }, user: { user_id } },
        }))
            ? true
            : false;
    }

    likeCount(blog_id: number) {
        return this.likeRepositry
            .createQueryBuilder("like")
            .where("like.blog = :blog_id", { blog_id })
            .loadRelationCountAndMap("likeCount", "like.blog")
            .getCount();
    }

    remove(like: BlogLike) {
        this.likeRepositry.delete(like);
        return { message: "liked has been removed" };
    }
}

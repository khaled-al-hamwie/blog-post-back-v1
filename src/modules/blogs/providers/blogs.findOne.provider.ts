import { Injectable } from "@nestjs/common";
import { BlogLikesService } from "src/modules/likes/providers/blog-likes.service";
import { FindOneOptions, FindOptionsSelect } from "typeorm";
import { Blog } from "../entities/blog.entity";

@Injectable()
export class BlogsFindOneProvider {
    constructor(private readonly blogLikesService: BlogLikesService) {}
    GetOptions(blog_id: number): FindOneOptions<Blog> {
        const option: FindOneOptions<Blog> = {};
        option.where = { blog_id };
        option.relations = { user: true };
        option.select = this.GetSelectOption();
        option.withDeleted = true;
        return option;
    }

    GetSelectOption(): FindOptionsSelect<Blog> {
        const select: FindOptionsSelect<Blog> = {
            user: {
                user_id: true,
                user_name: true,
                avatar: true,
                first_name: true,
                last_name: true,
            },
            blog_id: true,
            created_at: true,
            title: true,
            sub_title: true,
            minute_to_read: true,
            document: true,
            blog_pic: true,
            updated_at: true,
            deleted_at: true,
        };
        return select;
    }

    async provideLikes(blog: Blog, user_id) {
        return {
            blog,
            is_liked: await this.blogLikesService.isLiked(
                blog.blog_id,
                user_id,
            ),
            like_count: await this.blogLikesService.likeCount(blog.blog_id),
        };
    }
}

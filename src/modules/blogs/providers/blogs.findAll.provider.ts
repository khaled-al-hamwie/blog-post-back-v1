import { AbilityTuple, MongoAbility, MongoQuery } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { BlogLikesService } from "src/modules/likes/providers/blog-likes.service";
import { User } from "src/modules/users/entities/user.entity";
import {
    And,
    FindManyOptions,
    FindOptionsSelect,
    FindOptionsWhere,
    IsNull,
    LessThanOrEqual,
    Like,
    MoreThanOrEqual,
    Not,
} from "typeorm";
import { FindAllBlogDto } from "../dto/find-all-blog.dto";
import { Blog } from "../entities/blog.entity";
import { BlogAction } from "../enums/blogs.actions.enum";
import { BlogsAbilityFactory } from "../factories/blogs-ability.factory";

@Injectable()
export class BlogsFindAllProvider {
    constructor(
        private readonly blogsAbilityFactory: BlogsAbilityFactory,
        private readonly blogLikesService: BlogLikesService,
    ) {}

    GetOptions(
        findAllBlogDto: FindAllBlogDto,
        user: User,
    ): FindManyOptions<Blog> {
        const option: FindManyOptions<Blog> = {};
        const ability = this.blogsAbilityFactory.createForUser(user);
        option.where = this.GetWhereOptions(findAllBlogDto, ability, user);
        option.select = this.GetSelectOptions(ability);
        option.take = 10;
        option.skip = findAllBlogDto.page ? findAllBlogDto.page * 10 : 0;
        option.relations = { user: true };
        option.withDeleted = findAllBlogDto.only_deleted;
        return option;
    }

    GetWhereOptions(
        findAllBlogDto: FindAllBlogDto,
        ability: MongoAbility<AbilityTuple, MongoQuery>,
        user: User,
    ): FindOptionsWhere<Blog> | FindOptionsWhere<Blog>[] {
        const where: FindOptionsWhere<Blog> = {};
        const only_mine =
            findAllBlogDto.only_mine &&
            ability.can(BlogAction.CreateBlog, Blog);
        if (findAllBlogDto.title) where["title"] = Like(findAllBlogDto.title);
        if (findAllBlogDto.user_name)
            where.user = { user_name: findAllBlogDto.user_name };
        if (findAllBlogDto.created_after)
            where.created_at = MoreThanOrEqual(
                new Date(findAllBlogDto.created_after),
            );
        if (findAllBlogDto.created_before)
            where.created_at = LessThanOrEqual(
                new Date(findAllBlogDto.created_before),
            );
        if (findAllBlogDto.created_after && findAllBlogDto.created_before)
            where.created_at = And(
                LessThanOrEqual(new Date(findAllBlogDto.created_before)),
                MoreThanOrEqual(new Date(findAllBlogDto.created_after)),
            );
        if (only_mine) where.user = { user_id: user.user_id };
        if (
            findAllBlogDto.only_deleted &&
            ability.cannot(BlogAction.ReadDeletedBlog, Blog)
        ) {
            where.deleted_at = Not(IsNull());
            where.user = { user_id: user.user_id };
        }
        if (
            findAllBlogDto.only_deleted &&
            ability.can(BlogAction.ReadDeletedBlog, Blog)
        ) {
            where.deleted_at = Not(IsNull());
        }
        return where;
    }

    GetSelectOptions(
        ability: MongoAbility<AbilityTuple, MongoQuery>,
    ): FindOptionsSelect<Blog> {
        const select: FindOptionsSelect<Blog> = {
            user: { user_id: true, user_name: true, avatar: true },
            blog_id: true,
            created_at: true,
            title: true,
            sub_title: true,
            deleted_at: ability.can(BlogAction.ReadDeletedBlog, Blog),
        };
        return select;
    }

    async provideBlogsWithLikes(blogs: Blog[], user_id: number) {
        const blogsWithLikes = [];
        for (let i = 0; i < blogs.length; i++) {
            const element = blogs[i];
            blogsWithLikes.push({
                blog: element,
                is_liked: await this.blogLikesService.isLiked(
                    element.blog_id,
                    user_id,
                ),
                like_count: await this.blogLikesService.likeCount(
                    element.blog_id,
                ),
            });
        }
        return blogsWithLikes;
    }
}

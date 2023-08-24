import { AbilityTuple, MongoAbility, MongoQuery } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Action } from "src/modules/auth/enums/actions.enum";
import { User } from "src/modules/users/entities/user.entity";
import {
    And,
    FindManyOptions,
    FindOptionsSelect,
    FindOptionsWhere,
    LessThanOrEqual,
    Like,
    MoreThanOrEqual,
} from "typeorm";
import { FindAllBlogDto } from "../dto/find-all-blog.dto";
import { Blog } from "../entities/blog.entity";
import { BlogsAbilityFactory } from "../factories/blogs-ability.factory";

@Injectable()
export class BlogsFindAllProvider {
    constructor(private readonly blogsAbilityFactory: BlogsAbilityFactory) {}

    GetOptions(
        findAllBlogDto: FindAllBlogDto,
        user: User,
    ): FindManyOptions<Blog> {
        const option: FindManyOptions<Blog> = {};
        const ability = this.blogsAbilityFactory.createForUser(user);
        option.where = this.GetWhereOptions(findAllBlogDto);
        option.select = this.GetSelectOptions(ability);
        option.take = 10;
        option.skip = findAllBlogDto.page ? findAllBlogDto.page * 10 : 0;
        option.withDeleted = ability.can(Action.Read, Blog);
        return option;
    }

    GetWhereOptions(
        findAllBlogDto: FindAllBlogDto,
    ): FindOptionsWhere<Blog> | FindOptionsWhere<Blog>[] {
        const where: FindOptionsWhere<Blog> = {};
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
            deleted_at: ability.can(Action.Read, Blog),
        };
        return select;
    }
}

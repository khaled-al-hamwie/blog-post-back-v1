import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Put,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { UserDecorator } from "src/core/common/decorators/user.decorator";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { BlogsService } from "../blogs/blogs.service";
import { BlogAction } from "../blogs/enums/blogs.actions.enum";
import { BlogNotFoundException } from "../blogs/exceptions/BlogNotFound.exception";
import { User } from "../users/entities/user.entity";
import { Like } from "./entities/like.entity";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { likesAbilityFactory } from "./factories/like-ability.factory";
import { LikesService } from "./likes.service";

@UseGuards(LoggedInGuard)
@Controller("likes")
export class LikesController {
    constructor(
        private readonly likesService: LikesService,
        private readonly blogsService: BlogsService,
        private readonly likesAbilityFactory: likesAbilityFactory,
    ) {}

    @Put(":blog_id")
    async put(
        @Param("blog_id", ParseIntPipe) blog_id: number,
        @UserDecorator() user: User,
    ) {
        const blog = await this.blogsService.findOne({ where: { blog_id } });
        if (!blog) throw new BlogNotFoundException();
        const ability = this.likesAbilityFactory.createForUser(user);
        if (ability.cannot(BlogAction.LikeBlog, blog))
            throw new UnauthorizedException();
        const likedBlog: Like = await this.likesService.findOne({
            where: { blog: { blog_id }, user: { user_id: user.user_id } },
        });
        if (likedBlog) return this.likesService.remove(likedBlog);
        return this.likesService.create(blog, user.user_id);
    }

    @Get(":blog_id")
    async getLikes(
        @Param("blog_id", ParseIntPipe) blog_id: number,
        @UserDecorator("user_id") user_id: number,
    ) {
        const isLiked = await this.likesService.isLiked(blog_id, user_id);
        const likeCount = await this.likesService.likeCount(blog_id);
        return { is_liked: isLiked, like_count: likeCount };
    }
}

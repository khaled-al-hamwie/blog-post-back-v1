import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { UserDecorator } from "src/core/common/decorators/user.decorator";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { FindManyOptions } from "typeorm";
import { Action } from "../auth/enums/actions.enum";
import { User } from "../users/entities/user.entity";
import { BlogsService } from "./blogs.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { FindAllBlogDto } from "./dto/find-all-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { Blog } from "./entities/blog.entity";
import { BlogNotFoundException } from "./exceptions/BlogNotFound.exception";
import { BlogsAbilityFactory } from "./factories/blogs-ability.factory";
import { BlogsFindAllProvider } from "./providers/blogs.findAll.provider";

@UseGuards(LoggedInGuard)
@Controller("blogs")
export class BlogsController {
    constructor(
        private readonly blogsService: BlogsService,
        private readonly blogsAbilityFactory: BlogsAbilityFactory,
        private readonly blogsFindAllProvider: BlogsFindAllProvider,
    ) {}

    @Post()
    create(@Body() createBlogDto: CreateBlogDto, @UserDecorator() user: User) {
        const ability = this.blogsAbilityFactory.createForUser(user);
        if (ability.can(Action.Create, Blog)) {
            createBlogDto.author_id = user.user_id;
            return this.blogsService.create(createBlogDto);
        }
        throw new UnauthorizedException();
    }

    // or only mine and only deleted and page option
    // sort by created at or by most liked
    @Get()
    findAll(
        @UserDecorator() user: User,
        @Query() findAllBlogDto: FindAllBlogDto,
    ) {
        const option: FindManyOptions<Blog> =
            this.blogsFindAllProvider.GetOptions(findAllBlogDto, user);
        return this.blogsService.findAll(option);
    }

    @Get(":id")
    async findOne(
        @Param("id", ParseIntPipe) blog_id: number,
        @UserDecorator() user: User,
    ) {
        const ability = this.blogsAbilityFactory.createForUser(user);
        const blog = await this.blogsService.findOne({
            where: { blog_id },
            relations: { user: true },
            select: {
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
                deleted_at: ability.can(Action.Read, Blog),
            },
            withDeleted: ability.can(Action.Read, Blog),
        });
        if (!blog) throw new BlogNotFoundException();
        return blog;
    }

    @Patch(":id")
    update(
        @UserDecorator() user: User,
        @Param("id", ParseIntPipe) blog_id: number,
        @Body() updateBlogDto: UpdateBlogDto,
    ) {
        const ability = this.blogsAbilityFactory.createForUser(user);
        if (ability.can(Action.Update, Blog)) {
            updateBlogDto.author_id = user.user_id;
            return this.blogsService.update(blog_id, updateBlogDto);
        }
        throw new UnauthorizedException();
    }

    @Delete(":id")
    async remove(
        @Param("id", ParseIntPipe) blog_id: number,
        @UserDecorator() user: User,
    ) {
        const ability = this.blogsAbilityFactory.createForUser(user);
        const blog = await this.blogsService.findOne({
            where: { blog_id },
            relations: { user: true },
        });
        if (!blog) throw new BlogNotFoundException();
        if (ability.can(Action.Delete, Blog))
            return this.blogsService.remove(blog);
        else if (blog.user.user_id == user.user_id)
            return this.blogsService.remove(blog);
        else throw new UnauthorizedException();
    }
}

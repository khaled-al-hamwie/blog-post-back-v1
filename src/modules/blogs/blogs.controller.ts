import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { UserDecorator } from "src/core/common/decorators/user.decorator";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { Action } from "../auth/enums/actions.enum";
import { User } from "../users/entities/user.entity";
import { BlogsService } from "./blogs.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { Blog } from "./entities/blog.entity";
import { BlogNotFoundException } from "./exceptions/BlogNotFound.exception";
import { BlogsAbilityFactory } from "./factories/blogs-ability.factory";

@UseGuards(LoggedInGuard)
@Controller("blogs")
export class BlogsController {
    constructor(
        private readonly blogsService: BlogsService,
        private readonly blogsAbilityFactory: BlogsAbilityFactory,
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

    // find by title or user_name or by created_at certain time or only mine
    // sort by created at or by most liked
    @Get()
    findAll(@UserDecorator() user: User) {
        const ability = this.blogsAbilityFactory.createForUser(user);
        return this.blogsService.findAll({
            order: { created_at: "DESC" },
            relations: { user: true },
            select: {
                user: { user_id: true, user_name: true, avatar: true },
                blog_id: true,
                created_at: true,
                title: true,
                sub_title: true,
            },
            withDeleted: ability.can(Action.Read, Blog),
        });
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
                user: { user_id: true, user_name: true, avatar: true },
                blog_id: true,
                created_at: true,
                title: true,
                sub_title: true,
                minute_to_read: true,
                document: true,
                blog_pic: true,
                updated_at: true,
            },
            withDeleted: ability.can(Action.Read, Blog),
        });
        if (!blog) throw new BlogNotFoundException();
        return blog;
    }

    // only his
    @Patch(":id")
    update(@Param("id") id: string, @Body() updateBlogDto: UpdateBlogDto) {
        return this.blogsService.update(+id, updateBlogDto);
    }

    // all
    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.blogsService.remove(+id);
    }
}

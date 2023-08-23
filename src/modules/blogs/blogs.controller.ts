import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
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

    // all and if you are admin you can see the deleted post
    @Get()
    findAll() {
        return this.blogsService.findAll();
    }

    // all
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.blogsService.findOne(+id);
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

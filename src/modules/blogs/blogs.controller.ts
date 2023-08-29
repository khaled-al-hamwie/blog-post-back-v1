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
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
} from "@nestjs/common";
import { UserDecorator } from "src/core/common/decorators/user.decorator";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { UploadService } from "src/core/uploads/upload.service";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { User } from "../users/entities/user.entity";
import { BlogsService } from "./blogs.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { FindAllBlogDto } from "./dto/find-all-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { Blog } from "./entities/blog.entity";
import { BlogAction } from "./enums/blogs.actions.enum";
import { BlogNotFoundException } from "./exceptions/BlogNotFound.exception";
import { BlogsAbilityFactory } from "./factories/blogs-ability.factory";
import { BlogsInterceptor } from "./interceptors/blog.interceptor";
import { BlogPicPipe } from "./pipes/blog-pic.pipe";
import { BlogsFindAllProvider } from "./providers/blogs.findAll.provider";
import { BlogsFindOneProvider } from "./providers/blogs.findOne.provider";

@UseGuards(LoggedInGuard)
@Controller("blogs")
export class BlogsController {
    constructor(
        private readonly blogsService: BlogsService,
        private readonly blogsAbilityFactory: BlogsAbilityFactory,
        private readonly blogsFindAllProvider: BlogsFindAllProvider,
        private readonly blogsFindOneProvider: BlogsFindOneProvider,
        private readonly UploadService: UploadService,
    ) {}

    @UseInterceptors(BlogsInterceptor)
    @Post()
    create(
        @Body() createBlogDto: CreateBlogDto,
        @UserDecorator() user: User,
        @UploadedFile(new BlogPicPipe()) image?: Express.Multer.File,
    ) {
        if (image) {
            console.log(image);
            createBlogDto.blog_pic = this.UploadService.createName(
                image.originalname,
            );
            this.UploadService.upload(
                image.buffer,
                createBlogDto.blog_pic,
                "blogs",
            );
        }
        const ability = this.blogsAbilityFactory.createForUser(user);
        if (ability.can(BlogAction.CreateBlog, Blog)) {
            createBlogDto.author_id = user.user_id;
            return this.blogsService.create(createBlogDto);
        }
        throw new UnauthorizedException();
    }

    @Get()
    async findAll(
        @UserDecorator() user: User,
        @Query() findAllBlogDto: FindAllBlogDto,
    ) {
        const option: FindManyOptions<Blog> =
            this.blogsFindAllProvider.GetOptions(findAllBlogDto, user);
        const blogs = await this.blogsService.findAll(option);
        if (blogs.length == 0) throw new BlogNotFoundException();
        return this.blogsFindAllProvider.provideBlogsWithLikes(
            blogs,
            user.user_id,
        );
    }

    @Get(":id")
    async findOne(
        @Param("id", ParseIntPipe) blog_id: number,
        @UserDecorator() user: User,
    ) {
        const optons: FindOneOptions<Blog> =
            this.blogsFindOneProvider.GetOptions(blog_id);
        const ability = this.blogsAbilityFactory.createForUser(user);
        const blog = await this.blogsService.findOne(optons);
        if (blog && ability.can(BlogAction.ReadBlog, blog))
            return this.blogsFindOneProvider.provideLikes(blog, user.user_id);
        throw new BlogNotFoundException();
    }

    @Patch(":id")
    async update(
        @UserDecorator() user: User,
        @Param("id", ParseIntPipe) blog_id: number,
        @Body() updateBlogDto: UpdateBlogDto,
    ) {
        const ability = this.blogsAbilityFactory.createForUser(user);
        const blog = await this.blogsService.findOne({
            where: { blog_id },
            relations: { user: true },
        });
        if (!blog) throw new BlogNotFoundException();
        if (ability.can(BlogAction.UpdateBlog, blog)) {
            delete updateBlogDto.author_id;
            return this.blogsService.update(blog, updateBlogDto);
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
        else if (ability.can(BlogAction.DeleteBlog, blog))
            return this.blogsService.remove(blog);
        else throw new UnauthorizedException();
    }
}

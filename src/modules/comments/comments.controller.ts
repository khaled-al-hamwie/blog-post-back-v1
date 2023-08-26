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
import { BlogsService } from "../blogs/blogs.service";
import { BlogAction } from "../blogs/enums/blogs.actions.enum";
import { BlogNotFoundException } from "../blogs/exceptions/BlogNotFound.exception";
import { User } from "../users/entities/user.entity";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { FindAllCommentsDto } from "./dto/findAll-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { CommentNotFoundException } from "./exceptions/commnets-notFound.exception";
import { CommentsAbilityFactory } from "./factories/comments-ability.factory";
import { CommentsFindAllProvider } from "./providers/comments.findAll.provider";

@UseGuards(LoggedInGuard)
@Controller("comments")
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly commentsAbilityFactory: CommentsAbilityFactory,
        private readonly commentsFindAllProvider: CommentsFindAllProvider,
        private readonly blogsService: BlogsService,
    ) {}

    @Post(":blog_id")
    async create(
        @Param("blog_id", ParseIntPipe) blog_id: number,
        @Body() createCommentDto: CreateCommentDto,
        @UserDecorator() user: User,
    ) {
        const blog = await this.blogsService.findOne({ where: { blog_id } });
        if (!blog) throw new BlogNotFoundException();
        const ability = this.commentsAbilityFactory.createForUser(user);
        if (ability.can(BlogAction.CommentBlog, blog)) {
            createCommentDto.user_id = user.user_id;
            return this.commentsService.create(createCommentDto, blog);
        }
        throw new UnauthorizedException();
    }

    // sort by created_at , oldest newest , and most liked
    @Get(":blog_id")
    async findAll(
        @Param("blog_id", ParseIntPipe) blog_id: number,
        @Query() findAllCommentsDto: FindAllCommentsDto,
    ) {
        const blog = await this.blogsService.findOne({ where: { blog_id } });
        if (!blog) throw new BlogNotFoundException();
        const option = this.commentsFindAllProvider.GetOption(
            findAllCommentsDto,
            blog_id,
        );
        const comments = await this.commentsService.findAll(option);
        if (comments.length == 0) throw new CommentNotFoundException();
        return comments;
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        return this.commentsService.update(+id, updateCommentDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.commentsService.remove(+id);
    }
}
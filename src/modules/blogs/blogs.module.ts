import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LikesModule } from "../likes/likes.module";
import { UsersModule } from "../users/users.module";
import { BlogsController } from "./blogs.controller";
import { BlogsService } from "./blogs.service";
import { Blog } from "./entities/blog.entity";
import { BlogsAbilityFactory } from "./factories/blogs-ability.factory";
import { BlogsFindAllProvider } from "./providers/blogs.findAll.provider";
import { BlogsFindOneProvider } from "./providers/blogs.findOne.provider";

@Module({
    imports: [
        TypeOrmModule.forFeature([Blog]),
        UsersModule,
        forwardRef(() => LikesModule),
    ],
    controllers: [BlogsController],
    providers: [
        BlogsService,
        BlogsAbilityFactory,
        BlogsFindAllProvider,
        BlogsFindOneProvider,
    ],
    exports: [BlogsService],
})
export class BlogsModule {}

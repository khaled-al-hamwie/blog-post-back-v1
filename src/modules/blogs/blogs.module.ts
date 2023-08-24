import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { BlogsController } from "./blogs.controller";
import { BlogsService } from "./blogs.service";
import { Blog } from "./entities/blog.entity";
import { BlogsAbilityFactory } from "./factories/blogs-ability.factory";
import { BlogsFindAllProvider } from "./providers/blogs.findAll.provider";

@Module({
    imports: [TypeOrmModule.forFeature([Blog]), UsersModule],
    controllers: [BlogsController],
    providers: [BlogsService, BlogsAbilityFactory, BlogsFindAllProvider],
})
export class BlogsModule {}

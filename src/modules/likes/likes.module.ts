import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogsModule } from "../blogs/blogs.module";
import { Like } from "./entities/like.entity";
import { LikesController } from "./likes.controller";
import { LikesService } from "./likes.service";

@Module({
    imports: [TypeOrmModule.forFeature([Like]), BlogsModule],
    controllers: [LikesController],
    providers: [LikesService],
})
export class LikesModule {}

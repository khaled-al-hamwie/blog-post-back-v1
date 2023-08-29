import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SessionsModule } from "src/core/sessions/sessions.module";
import { UploadModule } from "src/core/uploads/upload.module";
import { DatabaseModule } from "../core/database/database.module";
import { AuthModule } from "./auth/auth.module";
import { BlogsModule } from "./blogs/blogs.module";
import { CommentsModule } from "./comments/comments.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { FollowsModule } from "./follow/follows.module";
import { LikesModule } from "./likes/likes.module";
import { RolesModule } from "./roles/roles.module";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        SessionsModule,
        UploadModule,
        AuthModule,
        UsersModule,
        RolesModule,
        BlogsModule,
        LikesModule,
        CommentsModule,
        FavoritesModule,
        FollowsModule,
    ],
})
export class AppModule {}

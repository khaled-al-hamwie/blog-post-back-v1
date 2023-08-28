import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SessionsModule } from "src/core/sessions/sessions.module";
import { DatabaseModule } from "../core/database/database.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { RolesModule } from "./roles/roles.module";
import { BlogsModule } from './blogs/blogs.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        SessionsModule,
        AuthModule,
        UsersModule,
        RolesModule,
        BlogsModule,
        LikesModule,
        CommentsModule,
        FavoritesModule,
    ],
})
export class AppModule {}

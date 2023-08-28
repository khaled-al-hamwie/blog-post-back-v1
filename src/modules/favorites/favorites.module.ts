import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogsModule } from "../blogs/blogs.module";
import { UsersModule } from "../users/users.module";
import { Favorite } from "./entities/favorite.entity";
import { FavoritesController } from "./favorites.controller";
import { FavoritesService } from "./favorites.service";

@Module({
    imports: [TypeOrmModule.forFeature([Favorite]), BlogsModule, UsersModule],
    controllers: [FavoritesController],
    providers: [FavoritesService],
})
export class FavoritesModule {}

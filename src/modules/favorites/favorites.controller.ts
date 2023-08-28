import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { UserDecorator } from "src/core/common/decorators/user.decorator";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { User } from "../users/entities/user.entity";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { FavoritesService } from "./favorites.service";

@UseGuards(LoggedInGuard)
@Controller("favorites")
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) {}

    @Put()
    async toggle(
        @Body() createFavoriteDto: CreateFavoriteDto,
        @UserDecorator() user: User,
    ) {
        createFavoriteDto.user_id = user.user_id;
        const createFavorite = await this.favoritesService.checkCreated(
            createFavoriteDto.user_id,
            createFavoriteDto.blog_id,
        );
        if (createFavorite) return this.favoritesService.remove(createFavorite);
        else return this.favoritesService.create(createFavoriteDto);
    }

    @Get()
    findAll(@UserDecorator("user_id") user_id: number) {
        return this.favoritesService.findAll({
            where: { user: { user_id } },
            order: { created_at: "ASC" },
            relations: { blog: { user: true } },
            select: {
                favorite_id: true,
                created_at: true,
                blog: {
                    blog_id: true,
                    title: true,
                    sub_title: true,
                    blog_pic: true,
                    user: {
                        user_id: true,
                        user_name: true,
                        first_name: true,
                        last_name: true,
                        avatar: true,
                    },
                },
            },
        });
    }
}

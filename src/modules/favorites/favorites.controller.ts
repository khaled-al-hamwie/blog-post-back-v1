import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { UserDecorator } from "src/core/common/decorators/user.decorator";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { User } from "../users/entities/user.entity";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { FavoritesService } from "./favorites.service";
import { FavoritesFindAllProvider } from "./providers/favorites.findAll.provider";

@UseGuards(LoggedInGuard)
@Controller("favorites")
export class FavoritesController {
    constructor(
        private readonly favoritesService: FavoritesService,
        private readonly favoritesFindAllProvider: FavoritesFindAllProvider,
    ) {}

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
        const options = this.favoritesFindAllProvider.GetOptions(user_id);
        return this.favoritesService.findAll(options);
    }
}

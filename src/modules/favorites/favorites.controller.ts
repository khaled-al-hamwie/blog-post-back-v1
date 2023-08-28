import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from "@nestjs/common";
import { UserDecorator } from "src/core/common/decorators/user.decorator";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { User } from "../users/entities/user.entity";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { FavoritesService } from "./favorites.service";

@UseGuards(LoggedInGuard)
@Controller("favorites")
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) {}

    @Post()
    create(
        @Body() createFavoriteDto: CreateFavoriteDto,
        @UserDecorator() user: User,
    ) {
        createFavoriteDto.user_id = user.user_id;
        return this.favoritesService.create(createFavoriteDto);
    }

    @Get()
    findAll() {
        return this.favoritesService.findAll();
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.favoritesService.remove(+id);
    }
}

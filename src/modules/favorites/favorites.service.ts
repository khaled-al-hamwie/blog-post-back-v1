import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlogsService } from "../blogs/blogs.service";
import { BlogNotFoundException } from "../blogs/exceptions/BlogNotFound.exception";
import { UsersService } from "../users/services/users.service";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { Favorite } from "./entities/favorite.entity";

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorite)
        private favoriteRepositry: Repository<Favorite>,
        private readonly blogsService: BlogsService,
        private readonly usersService: UsersService,
    ) {}
    async create(createFavoriteDto: CreateFavoriteDto) {
        const blog = await this.blogsService.findOne({
            where: { blog_id: createFavoriteDto.blog_id },
        });
        if (!blog) throw new BlogNotFoundException();
        const user = await this.usersService.findOne({
            where: { user_id: createFavoriteDto.user_id },
        });
        const favorite = this.favoriteRepositry.create();
        favorite.user = user;
        favorite.blog = blog;
        this.favoriteRepositry.save(favorite);
        return { message: "favorite has been added" };
    }

    findAll() {
        return `This action returns all favorites`;
    }

    findOne(id: number) {
        return `This action returns a #${id} favorite`;
    }

    remove(id: number) {
        return `This action removes a #${id} favorite`;
    }
}

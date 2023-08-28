import { Injectable } from "@nestjs/common";
import { FindManyOptions } from "typeorm";
import { Favorite } from "../entities/favorite.entity";

@Injectable()
export class FavoritesFindAllProvider {
    GetOptions(user_id: number): FindManyOptions<Favorite> {
        const options: FindManyOptions<Favorite> = {};
        options.relations = { blog: { user: true } };
        options.where = { user: { user_id } };
        options.order = { created_at: "ASC" };
        options.select = this.GetSelect();

        return options;
    }

    GetSelect() {
        return {
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
        };
    }
}

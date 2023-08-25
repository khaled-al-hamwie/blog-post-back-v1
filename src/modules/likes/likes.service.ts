import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { Blog } from "../blogs/entities/blog.entity";
import { UsersService } from "../users/services/users.service";
import { Like } from "./entities/like.entity";

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Like) private likeRepositry: Repository<Like>,
        private readonly usersService: UsersService,
    ) {}
    async create(blog: Blog, user_id: number) {
        const like = this.likeRepositry.create();
        like.blog = blog;
        like.user = await this.usersService.findOne({
            where: {
                user_id,
            },
        });
        this.likeRepositry.save(like);
        return { message: "like has been added" };
    }

    findOne(options: FindOneOptions<Like>) {
        return this.likeRepositry.findOne(options);
    }

    remove(id: number) {
        return `This action removes a #${id} like`;
    }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { UsersService } from "../users/services/users.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { Blog } from "./entities/blog.entity";

@Injectable()
export class BlogsService {
    constructor(
        @InjectRepository(Blog) private blogRepositry: Repository<Blog>,
        private readonly usersService: UsersService,
    ) {}

    async create(createBlogDto: CreateBlogDto) {
        const author = await this.usersService.findOne({
            where: { user_id: createBlogDto.author_id },
        });
        const blog = this.blogRepositry.create(createBlogDto);
        blog.user = author;
        this.blogRepositry.save(blog);
        return blog;
    }

    findAll(options: FindManyOptions<Blog>) {
        return this.blogRepositry.find(options);
    }

    findOne(options: FindOneOptions<Blog>) {
        return this.blogRepositry.findOne(options);
    }

    update(id: number, updateBlogDto: UpdateBlogDto) {
        return `This action updates a #${id} blog`;
    }

    remove(id: number) {
        return `This action removes a #${id} blog`;
    }
}

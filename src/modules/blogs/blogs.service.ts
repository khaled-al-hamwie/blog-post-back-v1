import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { Blog } from "./entities/blog.entity";

@Injectable()
export class BlogsService {
    constructor(
        @InjectRepository(Blog) private blogRepositry: Repository<Blog>,
    ) {}

    async create(createBlogDto: CreateBlogDto) {
        const blog = this.blogRepositry.create(createBlogDto);
        return blog;
    }

    findAll() {
        return `This action returns all blogs`;
    }

    findOne(id: number) {
        return `This action returns a #${id} blog`;
    }

    update(id: number, updateBlogDto: UpdateBlogDto) {
        return `This action updates a #${id} blog`;
    }

    remove(id: number) {
        return `This action removes a #${id} blog`;
    }
}

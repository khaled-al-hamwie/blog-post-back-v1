import { Injectable } from "@nestjs/common";
import { CreateFollowerDto } from "./dto/create-follower.dto";

@Injectable()
export class FollowersService {
    create(createFollowerDto: CreateFollowerDto) {
        return "This action adds a new follower";
    }

    findAll() {
        return `This action returns all followers`;
    }

    findOne(id: number) {
        return `This action returns a #${id} follower`;
    }

    remove(id: number) {
        return `This action removes a #${id} follower`;
    }
}

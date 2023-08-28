import { Injectable, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { FindOneOptions, Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { UserNotFoundException } from "../users/exceptions/userNotFound.exception";
import { UsersService } from "../users/services/users.service";
import { CreateFollowerDto } from "./dto/create-follower.dto";
import { Follower } from "./entities/follower.entity";
import { AlreadyFollowedException } from "./exceptions/already-followed.exception";

@UseGuards(LoggedInGuard)
@Injectable()
export class FollowersService {
    constructor(
        @InjectRepository(Follower)
        private readonly followerEntity: Repository<Follower>,
        private readonly usersService: UsersService,
    ) {}
    async create(createFollowerDto: CreateFollowerDto) {
        const alreadyFollow = await this.findOne({
            where: {
                user: { user_id: createFollowerDto.user_id },
                follower: { user_id: createFollowerDto.follower_id },
            },
        });
        if (alreadyFollow) throw new AlreadyFollowedException();
        const user = await this.usersService.findOne({
            relations: { role: true },
            where: { user_id: createFollowerDto.user_id, role: { role_id: 1 } },
        });
        if (!user) throw new UserNotFoundException();
        const follower = await this.usersService.findOne({
            where: { user_id: createFollowerDto.follower_id },
        });
        const follow = this.followerEntity.create();
        follow.follower = follower;
        follow.user = user;
        this.followerEntity.save(follow);
        return { message: "follow has been added" };
    }

    findAll() {
        return `This action returns all followers`;
    }

    findOne(options: FindOneOptions<Follower>) {
        return this.followerEntity.findOne(options);
    }

    remove(id: number) {
        return `This action removes a #${id} follower`;
    }
}

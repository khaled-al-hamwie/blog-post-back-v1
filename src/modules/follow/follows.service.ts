import { Injectable, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LoggedInGuard } from "src/core/common/guards/logged-in.guard";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { UserNotFoundException } from "../users/exceptions/userNotFound.exception";
import { UsersService } from "../users/services/users.service";
import { CreateFollowDto } from "./dto/create-follow.dto";
import { Follow } from "./entities/follow.entity";
import { AlreadyFollowedException } from "./exceptions/already-followed.exception";

@UseGuards(LoggedInGuard)
@Injectable()
export class FollowsService {
    constructor(
        @InjectRepository(Follow)
        private readonly followerEntity: Repository<Follow>,
        private readonly usersService: UsersService,
    ) {}
    async create(createFollowerDto: CreateFollowDto) {
        await this.checkAlreadyFollow(createFollowerDto);

        const follow = this.followerEntity.create();
        follow.follower = await this.getUser(createFollowerDto.follower_id);
        follow.user = await this.getUser(createFollowerDto.user_id);
        this.followerEntity.save(follow);
        return { message: "follow has been added" };
    }

    findAll(options: FindManyOptions<Follow>) {
        return this.followerEntity.find(options);
    }

    findOne(options: FindOneOptions<Follow>) {
        return this.followerEntity.findOne(options);
    }

    count(options: FindManyOptions<Follow>) {
        return this.followerEntity.count(options);
    }

    remove(follow: Follow) {
        this.followerEntity.remove(follow);
        return { message: "follow has been removed" };
    }

    private async checkAlreadyFollow(createFollowerDto: CreateFollowDto) {
        const alreadyFollow = await this.findOne({
            where: {
                user: { user_id: createFollowerDto.user_id },
                follower: { user_id: createFollowerDto.follower_id },
            },
        });
        if (alreadyFollow) throw new AlreadyFollowedException();
    }

    private async getUser(user_id: number) {
        const user = await this.usersService.findOne({
            relations: { role: true },
            where: { user_id, role: { role_id: 1 } },
        });
        if (!user) throw new UserNotFoundException();
        return user;
    }
}

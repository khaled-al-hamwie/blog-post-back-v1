import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}
    async create(createUserDto: CreateUserDto) {
        const userWithSameUserName: User = await this.findOne({
            where: { user_name: createUserDto.user_name },
        });
        if (userWithSameUserName)
            throw new ForbiddenException("you can't use this user name");
        const user = this.usersRepository.create(createUserDto);
        this.usersRepository.save(user);
        return user;
    }

    findAll() {
        return `This action returns all users`;
    }

    findOne(options: FindOneOptions): Promise<User> {
        return this.usersRepository.findOne(options);
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}

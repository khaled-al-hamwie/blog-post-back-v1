import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { compareSync, hashSync } from "bcrypt";
import { FindOneOptions, Repository } from "typeorm";
import { LoginUserDto } from "../auth/dto/login-user.dto";
import { RolesService } from "../roles/roles.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserNameNotAllowedException } from "./exceptions/userNameNotAllowed.exception";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly rolesService: RolesService,
    ) {}
    async create(createUserDto: CreateUserDto) {
        const role = await this.rolesService.findOne({
            where: {
                name: createUserDto.role_name
                    ? createUserDto.role_name
                    : "default",
            },
        });
        const userWithSameUserName: User = await this.findOne({
            where: { user_name: createUserDto.user_name },
        });
        if (userWithSameUserName) throw new UserNameNotAllowedException();
        createUserDto.password = hashSync(createUserDto.password, 12);
        const user = this.usersRepository.create(createUserDto);
        user.role = role;
        await this.usersRepository.save(user);
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

    async validate({
        user_name,
        password,
    }: LoginUserDto): Promise<Omit<User, "password">> {
        const user = await this.findOne({
            where: { user_name },
        });
        if (user && compareSync(password, user.password)) {
            delete user.password;
            return user;
        }
        return null;
    }
}

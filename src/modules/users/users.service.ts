import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { compareSync, hashSync } from "bcrypt";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { LoginUserDto } from "../auth/dto/login-user.dto";
import { Action } from "../auth/enums/actions.enum";
import { RolesService } from "../roles/roles.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UserNameNotAllowedException } from "./exceptions/userNameNotAllowed.exception";
import { UsersAbilityFactory } from "./factories/users-ability.factory";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly rolesService: RolesService,
        private readonly userAbilityFactory: UsersAbilityFactory,
    ) {}
    async create(createUserDto: CreateUserDto) {
        let role_id = 1;
        if (createUserDto.role_id && createUserDto.role_id == 3)
            role_id = createUserDto.role_id;
        const role = await this.rolesService.findOne({
            where: {
                role_id,
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

    findAll(options: FindManyOptions<User>) {
        return this.usersRepository.find(options);
    }

    async findOne(
        options: FindOneOptions,
        delete_password = true,
    ): Promise<User> {
        const requiredUser = await this.usersRepository.findOne(options);
        if (requiredUser && delete_password) delete requiredUser.password;
        return requiredUser;
    }

    async update(user: User, updateUserDto: UpdateUserDto) {
        const requiredUser = await this.findOne({
            where: { user_id: user.user_id },
        });
        this.usersRepository.save({ ...requiredUser, ...updateUserDto });
        return { message: "user has been updated succsesfully" };
    }

    async remove(user: User) {
        const requiredUser = await this.findOne({
            where: { user_id: user.user_id },
        });
        this.usersRepository.softRemove(requiredUser);
        return { message: "user has been removed succsesfully" };
    }

    async validate({
        user_name,
        password,
    }: LoginUserDto): Promise<Omit<User, "password">> {
        const user = await this.findOne(
            {
                where: { user_name },
            },
            false,
        );
        if (user && compareSync(password, user.password)) {
            delete user["password"];
            delete user["first_name"];
            delete user["last_name"];
            delete user["profile"];
            delete user["avatar"];
            return user;
        }
        return null;
    }
}

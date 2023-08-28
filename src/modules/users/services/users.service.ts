import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { compareSync, hashSync } from "bcrypt";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { RolesService } from "../../roles/roles.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";
import { UserNameNotAllowedException } from "../exceptions/userNameNotAllowed.exception";
import { UserNotFoundException } from "../exceptions/userNotFound.exception";

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
                role_id: createUserDto.role_id,
            },
        });
        await this.checkUserWithSameUserName(createUserDto.user_name);
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

    async putAvatar(user_id: number, avatar: Express.Multer.File) {
        const user = await this.findOne({ where: { user_id } });
        user.avatar = avatar ? avatar.path : "";
        this.usersRepository.save(user);
        return { message: "avatar has been upload" };
    }

    async remove(user: User) {
        if (!user) throw new UserNotFoundException();
        this.usersRepository.softRemove(user);
        return { message: "user has been removed succsesfully" };
    }

    async restore(user: User) {
        if (!user) throw new UserNotFoundException();
        await this.usersRepository.recover(user);
        return { message: "user has been restored succsesfully" };
    }

    async validate(
        user: User,
        password: string,
    ): Promise<Omit<User, "password">> {
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

    private async checkUserWithSameUserName(user_name: string) {
        const userWithSameUserName: User = await this.findOne({
            where: { user_name },
            withDeleted: true,
        });
        if (userWithSameUserName) throw new UserNameNotAllowedException();
    }
}

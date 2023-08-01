import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { Role } from "./entities/role.entity";

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role) private rolesRepository: Repository<Role>,
    ) {}
    findAll() {
        return `This action returns all roles`;
    }

    findOne(options: FindOneOptions<Role>) {
        return this.rolesRepository.findOne(options);
    }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { Role } from "./entities/role.entity";

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role) private rolesRepository: Repository<Role>,
    ) {}
    findAll(options: FindManyOptions<Role>) {
        return this.rolesRepository.find(options);
    }

    findOne(options: FindOneOptions<Role>) {
        return this.rolesRepository.findOne(options);
    }
}

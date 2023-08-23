import { Injectable } from "@nestjs/common";
import { RolesService } from "src/modules/roles/roles.service";
import { User } from "../entities/user.entity";

@Injectable()
export class UsersRolesService {
    constructor(private readonly rolesService: RolesService) {}

    IsAdmin(user: User) {
        // const role = await this.rolesService.findOne({
        //     where: { name: "admin" },
        // });
        if (user.role.name == "admin") return true;
        return false;
    }
    IsSuperAdmin(user: User) {
        // const role = await this.rolesService.findOne({
        //     where: { name: "super admin" },
        // });
        if (user.role.name == "super admin") return true;
        return false;
    }
    IsDefault(user: User) {
        // const role = await this.rolesService.findOne({
        //     where: { name: "default" },
        // });
        if (user.role.name == "default") return true;
        return false;
    }
}

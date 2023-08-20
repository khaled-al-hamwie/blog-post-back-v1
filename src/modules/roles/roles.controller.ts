import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminGuard } from "src/core/common/guards/admin.guard";
import { RolesService } from "./roles.service";

@Controller("roles")
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @UseGuards(AdminGuard)
    @Get()
    findAll() {
        return this.rolesService.findAll({});
    }
}

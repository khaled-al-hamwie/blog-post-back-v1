import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "../roles/roles.module";
import { User } from "./entities/user.entity";
import { UsersAbilityFactory } from "./factories/users-ability.factory";
import { UsersRolesService } from "./services/users.roles.service";
import { UsersService } from "./services/users.service";
import { UsersController } from "./users.controller";

@Module({
    imports: [TypeOrmModule.forFeature([User]), RolesModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRolesService, UsersAbilityFactory],
    exports: [UsersService],
})
export class UsersModule {}

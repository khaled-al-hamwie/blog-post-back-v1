import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesModule } from "../roles/roles.module";
import { User } from "./entities/user.entity";
import { UsersAbilityFactory } from "./factories/users-ability.factory";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
    imports: [TypeOrmModule.forFeature([User]), RolesModule],
    controllers: [UsersController],
    providers: [UsersService, UsersAbilityFactory],
    exports: [UsersService],
})
export class UsersModule {}

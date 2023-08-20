import { PartialType } from "@nestjs/mapped-types";
import { IsEnum } from "class-validator";
import { RoleNameEnum } from "../enums/role-name.enum";
import { RegisterUserDto } from "./register-user.dto";

export class RegisterAdminDto extends PartialType(RegisterUserDto) {
    @IsEnum(RoleNameEnum)
    role_name: string;
}

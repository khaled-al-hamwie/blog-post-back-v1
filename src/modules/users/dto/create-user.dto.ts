import { PartialType } from "@nestjs/mapped-types";
import { RegisterUserDto } from "src/modules/auth/dto/register-user.dto";
import { User } from "../entities/user.entity";

export class CreateUserDto extends PartialType(RegisterUserDto) {
    role_name?: string;
    user?: User;
}

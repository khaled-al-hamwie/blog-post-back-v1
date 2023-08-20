import { PartialType } from "@nestjs/mapped-types";
import { IsInt, Max, Min } from "class-validator";
import { RegisterUserDto } from "./register-user.dto";

export class RegisterAdminDto extends PartialType(RegisterUserDto) {
    @IsInt()
    @Min(0)
    @Max(255)
    role_id: number;
}

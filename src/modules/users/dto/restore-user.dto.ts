import { PickType } from "@nestjs/mapped-types";
import { RegisterUserDto } from "src/modules/auth/dto/register-user.dto";

export class RestoreUserDto extends PickType(RegisterUserDto, ["user_name"]) {}

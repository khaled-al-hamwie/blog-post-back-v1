import { IsEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto {
    @IsString()
    @MaxLength(45)
    @MinLength(8)
    user_name: string;

    @IsString()
    @MaxLength(40)
    @MinLength(20)
    password: string;

    @IsString()
    @MaxLength(20)
    @MinLength(3)
    first_name: string;

    @IsString()
    @MaxLength(20)
    @MinLength(3)
    last_name: string;

    @IsEmpty()
    @IsString()
    @MaxLength(255)
    profile: string;
}

import { IsOptional, IsString, Length, MaxLength } from "class-validator";

export class RegisterUserDto {
    @IsString()
    @Length(8, 45)
    user_name: string;

    @IsString()
    @Length(8, 40)
    password: string;

    @IsString()
    @Length(3, 20)
    first_name: string;

    @IsString()
    @Length(3, 20)
    last_name: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    profile: string;
}

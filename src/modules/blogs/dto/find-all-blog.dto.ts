import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class FindAllBlogDto {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    user_name: string;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(0)
    page: number;
}

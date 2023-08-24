import { Transform } from "class-transformer";
import { IsISO8601, IsInt, IsOptional, IsString, Min } from "class-validator";

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

    @IsOptional()
    @IsISO8601()
    created_after: string;

    @IsOptional()
    @IsISO8601()
    created_before: string;
}

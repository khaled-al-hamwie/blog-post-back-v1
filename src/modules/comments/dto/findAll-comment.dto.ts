import { Transform } from "class-transformer";
import { IsIn, IsInt, IsOptional, Min } from "class-validator";

export class FindAllCommentsDto {
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    @Min(0)
    page: number;

    @IsOptional()
    @IsIn(["oldest", "newest", "relavent"])
    sort: string;
}

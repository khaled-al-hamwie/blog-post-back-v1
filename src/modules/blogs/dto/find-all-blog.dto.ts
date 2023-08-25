import { Transform } from "class-transformer";
import {
    IsISO8601,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from "class-validator";
import { IsEitherUserNameOrOnlyMine } from "src/core/common/decorators/is-either-user-name-or-only-mine.decorator";

export class FindAllBlogDto {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsEitherUserNameOrOnlyMine({
        message: "you can't use both user name and only mine",
    })
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

    @IsOptional()
    @IsIn(["yes"], {
        message: "you can only provide yes or don't provide an option",
    })
    only_mine: boolean;

    @IsOptional()
    @IsIn(["yes"], {
        message: "you can only provide yes or don't provide an option",
    })
    only_deleted: boolean;
}

import { IsInt, IsOptional, IsString, Length, Min } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @Length(1, 2000)
    comment: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    comment_id: number;

    user_id: number;
}

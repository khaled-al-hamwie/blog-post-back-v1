import { IsString, Length } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @Length(1, 2000)
    comment: string;

    user_id: number;
}

import { IsInt, Min } from "class-validator";

export class CreateFavoriteDto {
    @IsInt()
    @Min(0)
    blog_id: number;

    user_id: number;
}

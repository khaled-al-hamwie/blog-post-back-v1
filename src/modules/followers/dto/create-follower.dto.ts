import { IsInt, Min } from "class-validator";

export class CreateFollowerDto {
    @IsInt()
    @Min(0)
    user_id: number;

    follower_id: number;
}

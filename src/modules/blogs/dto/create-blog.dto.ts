import { IsInt, IsString, Length, Min } from "class-validator";

export class CreateBlogDto {
    @IsString()
    @Length(4, 25)
    title: string;

    @IsString()
    @Length(4, 45)
    sub_title: string;

    @IsString()
    @Length(10, 5000)
    document: string;

    @IsInt()
    @Min(1)
    minute_to_read: number;

    author_id: number;
}

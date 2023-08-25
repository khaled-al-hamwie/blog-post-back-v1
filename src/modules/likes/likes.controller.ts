import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { CreateLikeDto } from "./dto/create-like.dto";
import { LikesService } from "./likes.service";

@Controller("likes")
export class LikesController {
    constructor(private readonly likesService: LikesService) {}

    @Post()
    create(@Body() createLikeDto: CreateLikeDto) {
        return this.likesService.create(createLikeDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.likesService.remove(+id);
    }
}

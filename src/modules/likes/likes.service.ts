import { Injectable } from "@nestjs/common";
import { CreateLikeDto } from "./dto/create-like.dto";

@Injectable()
export class LikesService {
    create(createLikeDto: CreateLikeDto) {
        return "This action adds a new like";
    }

    remove(id: number) {
        return `This action removes a #${id} like`;
    }
}

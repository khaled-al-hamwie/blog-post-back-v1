import { HttpException, HttpStatus } from "@nestjs/common";

export class LikeCreatedException extends HttpException {
    constructor() {
        super(
            "you have already created like for this post",
            HttpStatus.FORBIDDEN,
        );
    }
}

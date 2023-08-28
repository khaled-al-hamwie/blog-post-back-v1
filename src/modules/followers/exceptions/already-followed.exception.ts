import { HttpException, HttpStatus } from "@nestjs/common";

export class AlreadyFollowedException extends HttpException {
    constructor() {
        super("Already followed user", HttpStatus.FORBIDDEN);
    }
}

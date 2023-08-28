import { HttpException, HttpStatus } from "@nestjs/common";

export class NoFollowingException extends HttpException {
    constructor() {
        super("no following yet", HttpStatus.NOT_FOUND);
    }
}

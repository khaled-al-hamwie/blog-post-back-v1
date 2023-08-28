import { HttpException, HttpStatus } from "@nestjs/common";

export class NoFollowerException extends HttpException {
    constructor() {
        super("no follower yet", HttpStatus.NOT_FOUND);
    }
}

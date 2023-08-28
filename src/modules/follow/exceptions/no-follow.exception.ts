import { HttpException, HttpStatus } from "@nestjs/common";

export class NoFollowException extends HttpException {
    constructor() {
        super("follow not found", HttpStatus.NOT_FOUND);
    }
}

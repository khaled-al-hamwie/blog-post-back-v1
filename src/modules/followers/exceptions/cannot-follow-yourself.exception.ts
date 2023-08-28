import { HttpException, HttpStatus } from "@nestjs/common";

export class CannotFollowYourselfException extends HttpException {
    constructor() {
        super("cannot follow your self", HttpStatus.FORBIDDEN);
    }
}

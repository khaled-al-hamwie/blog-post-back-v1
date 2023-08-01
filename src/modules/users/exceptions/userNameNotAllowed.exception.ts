import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNameNotAllowedException extends HttpException {
    constructor() {
        super("user_name not allowed", HttpStatus.FORBIDDEN);
    }
}

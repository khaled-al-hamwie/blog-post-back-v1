import { HttpException, HttpStatus } from "@nestjs/common";

export class UserUnauthorizedException extends HttpException {
    constructor() {
        super("unauthorized user", HttpStatus.FORBIDDEN);
    }
}

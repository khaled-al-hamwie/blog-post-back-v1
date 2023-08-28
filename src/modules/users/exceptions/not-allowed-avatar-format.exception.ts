import { HttpException, HttpStatus } from "@nestjs/common";

export class NotAllowedAvatarFormatException extends HttpException {
    constructor() {
        super("not allowed avatar format", HttpStatus.FORBIDDEN);
    }
}

import { HttpException, HttpStatus } from "@nestjs/common";

export class BlogNotFoundException extends HttpException {
    constructor() {
        super("Blog not found", HttpStatus.NOT_FOUND);
    }
}

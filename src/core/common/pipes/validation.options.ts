import { HttpStatus, ValidationPipeOptions } from "@nestjs/common";

export const ValidationOptions: ValidationPipeOptions = {
    stopAtFirstError: true,
    whitelist: true,
    errorHttpStatusCode: HttpStatus.FORBIDDEN,
};

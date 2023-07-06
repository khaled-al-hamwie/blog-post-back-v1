import { ValidationPipe } from "@nestjs/common";
import { ValidationOptions } from "./validation.options";

export const MainValidationPipe: ValidationPipe = new ValidationPipe(
    ValidationOptions,
);

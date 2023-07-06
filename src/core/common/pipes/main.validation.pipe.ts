import { ValidationPipe } from "@nestjs/common";
import { ValidationOptions } from "./options/validation.options";

export const MainValidationPipe: ValidationPipe = new ValidationPipe(
    ValidationOptions,
);

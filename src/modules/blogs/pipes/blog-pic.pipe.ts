import {
    ArgumentMetadata,
    HttpException,
    HttpStatus,
    Injectable,
    PipeTransform,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class BlogPicPipe implements PipeTransform {
    async transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
        if (!value) {
            return null;
        }

        // Validate the image file type
        const allowedTypes = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "JPG",
            "JPEG",
            "PNG",
            "GIF",
        ];
        const fileType = value.originalname.split(".").pop();
        if (!allowedTypes.includes(fileType)) {
            throw new HttpException(
                "Validation failed: Invalid file type",
                HttpStatus.BAD_REQUEST,
            );
        }

        // Transform the validated value into the desired format
        const transformedValue = plainToClass(metadata.metatype, value);

        // Additional validation using class-validator decorators can be performed here if needed
        const errors = await validate(transformedValue);
        if (errors.length > 0) {
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }

        return transformedValue;
    }
}

import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import { NotAllowedAvatarFormatException } from "../exceptions/not-allowed-avatar-format.exception";

const multerOptions: MulterOptions = {
    fileFilter(req, file, callback) {
        if (
            file &&
            file.originalname.match(
                /[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/,
            )
        ) {
            callback(null, true);
        } else callback(new NotAllowedAvatarFormatException(), false);
    },
    storage: diskStorage({
        destination: "./uploads/avatars",
        filename: (req, file, callback) => {
            if (file) {
                const filename = Date.now() + "-" + file.originalname;
                callback(null, filename);
            } else callback(null, "");
        },
    }),
};

export const AvatarInterceptor = FileInterceptor("avatar", multerOptions);

import { FileInterceptor } from "@nestjs/platform-express";

export const BlogsInterceptor = FileInterceptor("blog_pic", {
    limits: { fileSize: 10000000 },
});

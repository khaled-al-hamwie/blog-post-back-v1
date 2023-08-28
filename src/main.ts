import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { MainValidationPipe } from "./core/common/pipes/main.validation.pipe";
import { AppModule } from "./modules/app.module";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(MainValidationPipe);
    app.useStaticAssets(join(__dirname, "..", "uploads"));
    await app.listen(4000);
}
bootstrap();

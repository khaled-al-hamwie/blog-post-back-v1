import { NestFactory } from "@nestjs/core";
import { MainValidationPipe } from "./core/common/pipes/main.validation.pipe";
import { AppModule } from "./modules/app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(MainValidationPipe);
    await app.listen(3000);
}
bootstrap();

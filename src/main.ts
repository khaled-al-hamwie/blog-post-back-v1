import { NestFactory } from "@nestjs/core";
import * as session from "express-session";
import * as passport from "passport";
import { MainValidationPipe } from "./core/common/pipes/main.validation.pipe";
import { AppModule } from "./modules/app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(MainValidationPipe);
    app.use(
        session({
            secret: "my-secret",
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 3600000 },
        }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(3000);
}
bootstrap();

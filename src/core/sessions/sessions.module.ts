import { Inject, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import RedisStore from "connect-redis";
import * as session from "express-session";
import * as passport from "passport";
import { REDIS } from "../constants/redis";
import { RedisModule } from "../database/redis/redis.module";
@Module({
    imports: [RedisModule],
})
export class SessionsModule implements NestModule {
    constructor(
        @Inject(REDIS) private readonly redis,
        private readonly configService: ConfigService,
    ) {}
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                session({
                    store: new RedisStore({
                        client: this.redis,
                        prefix: `${this.configService.get<string>(
                            "REDIS_DB_NAME",
                        )}:`,
                    }),
                    saveUninitialized: false,
                    secret: this.configService.get<string>("SESSION_SECRET"),
                    resave: false,

                    cookie: {
                        sameSite: true,
                        httpOnly: false,
                        maxAge: +this.configService.get<string>(
                            "COOKIE_MAX_AGE",
                        ),
                    },
                }),
                passport.initialize(),
                passport.session(),
            )
            .forRoutes("*");
    }
}

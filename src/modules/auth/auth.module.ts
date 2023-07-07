import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthSerializer } from "./serialization.provider";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
    imports: [UsersModule, PassportModule.register({ session: true })],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, AuthSerializer],
})
export class AuthModule {}

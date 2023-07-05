import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    register(createAuthDto: any) {
        return "This action adds a new auth";
    }

    login() {
        return `This action returns all auth`;
    }
}

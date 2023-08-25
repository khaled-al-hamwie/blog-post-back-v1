import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class LoggedInGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        if (context.switchToHttp().getRequest().isAuthenticated()) return true;
        else throw new UnauthorizedException();
    }
}

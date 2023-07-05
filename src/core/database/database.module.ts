import { DynamicModule } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DEVELOPMENT, PRODUCTION, TEST } from "../constants/enviroment";
import { databaseConfig } from "./config/database.confing";

let config: TypeOrmModuleOptions;
switch (process.env.NODE_ENV) {
    case DEVELOPMENT:
        config = databaseConfig.development;
        break;
    case TEST:
        config = databaseConfig.test;
        break;
    case PRODUCTION:
        config = databaseConfig.production;
        break;
    default:
        config = databaseConfig.development;
}

export const DatabaseModule: DynamicModule = TypeOrmModule.forRoot(config);
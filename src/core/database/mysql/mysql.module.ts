import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DEVELOPMENT, PRODUCTION, TEST } from "src/core/constants/enviroment";
import { MysqlDatabaseConfig } from "./config/MysqlDatabase.confing";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const enviroment = configService.get<string>("NODE_ENV");
                let config: TypeOrmModuleOptions;
                switch (enviroment) {
                    case DEVELOPMENT:
                        config = MysqlDatabaseConfig.development;
                        break;
                    case TEST:
                        config = MysqlDatabaseConfig.test;
                        break;
                    case PRODUCTION:
                        config = MysqlDatabaseConfig.production;
                        break;
                    default:
                        config = MysqlDatabaseConfig.development;
                }
                return config;
            },
            inject: [ConfigService],
        }),
    ],
})
export class MysqlModule {}

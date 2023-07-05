import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export interface IDatabaseConfig {
    development: TypeOrmModuleOptions;
    test: TypeOrmModuleOptions;
    production: TypeOrmModuleOptions;
}

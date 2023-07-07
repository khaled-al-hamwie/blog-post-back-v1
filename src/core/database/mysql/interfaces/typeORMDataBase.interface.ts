import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export interface TypeORMDataBase {
    development: TypeOrmModuleOptions;
    test: TypeOrmModuleOptions;
    production: TypeOrmModuleOptions;
}

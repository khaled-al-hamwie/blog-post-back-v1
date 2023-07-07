import * as dotenv from "dotenv";
import { TypeORMDataBase } from "../interfaces/typeORMDataBase.interface";

dotenv.config();

export const MysqlDatabaseConfig: TypeORMDataBase = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME_DEVELOPMENT,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        type: "mysql",
        autoLoadEntities: true,
        synchronize: true,
        logging: ["info", "log", "warn", "error", "migration", "schema"],
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME_TEST,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        type: "mysql",
        autoLoadEntities: true,
        logging: false,
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME_PRODUCTION,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        type: "mysql",
        autoLoadEntities: true,
        logging: false,
    },
};

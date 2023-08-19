import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
dotenv.config();

const options: DataSourceOptions & SeederOptions = {
    type: "mysql",
    database: process.env.DB_NAME_DEVELOPMENT + "bla",
    username: process.env.DB_USER,
    password: process.env.DB_PASS,

    seeds: ["src/database/seeds/**/*{.ts,.js}"],
    factories: ["src/database/factories/**/*{.ts,.js}"],
};

export const dataSource = new DataSource(options);

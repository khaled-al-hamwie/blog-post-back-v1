import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { Role } from "./src/modules/roles/entities/role.entity";
import { User } from "./src/modules/users/entities/user.entity";
dotenv.config();

console.log("the file ");
const options: DataSourceOptions & SeederOptions = {
    type: "mysql",
    database: process.env.DB_NAME_DEVELOPMENT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    entities: [Role, User],
    seeds: ["./src/core/seeds/**/*{.ts,.js}"],
    factories: ["./src/core/factories/**/*{.ts,.js}"],
};

export const dataSource = new DataSource(options);

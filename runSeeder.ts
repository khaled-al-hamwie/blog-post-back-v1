import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions, runSeeders } from "typeorm-extension";
dotenv.config();
(async () => {
    const options: DataSourceOptions = {
        type: "mysql",
        database: process.env.DB_NAME_DEVELOPMENT,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
    };

    const dataSource = new DataSource(options);
    await dataSource.initialize();

    runSeeders(dataSource, {
        seeds: ["src/core/seeds/**/*{.ts,.js}"],
        factories: ["src/core/factories/**/*{.ts,.js}"],
    });
})();

// import { Role } from "src/modules/roles/entities/role.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Role } from "../../modules/roles/entities/role.entity";

console.log("runin the seed");
export default class Role1692477215572 implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<any> {
        const repositry = dataSource.getRepository(Role);
        await repositry.insert([{ role_id: 3, name: "blan bla" }]);
    }
}

import { Factory, Seeder } from "@paranode/typeorm-seeding";
import { Role } from "src/modules/roles/entities/role.entity";
import { DataSource } from "typeorm";

export default class RolesSeeder implements Seeder {
    async run(factory: Factory, connection: DataSource): Promise<void> {
        console.log("hi from the role seeder");
        const roleRepositry = connection.getRepository(Role);

        await roleRepositry
            .createQueryBuilder()
            .insert()
            .into(Role)
            .values([
                { role_id: 1, name: "default" },
                { role_id: 2, name: "admin" },
                { role_id: 3, name: "super admin" },
            ])
            .execute();
    }
}

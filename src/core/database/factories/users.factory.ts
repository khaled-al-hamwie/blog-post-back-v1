import { faker } from "@faker-js/faker";
import { define } from "@paranode/typeorm-seeding";
import { User } from "src/modules/users/entities/user.entity";

define(User, faker => {
    const user = new User();
    user.first_name = faker.name.firstName();
    user.last_name = faker.name.lastName();
    user.profile;
    user.user_name = `${user.first_name}-${user.last_name}`;
    return user;
});

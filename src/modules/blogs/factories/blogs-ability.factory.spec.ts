import { Test, TestingModule } from "@nestjs/testing";
import { Role } from "src/modules/roles/entities/role.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Blog } from "../entities/blog.entity";
import { BlogAction } from "../enums/blogs.actions.enum";
import { BlogsAbilityFactory } from "./blogs-ability.factory";

describe("Blogs ability factory", () => {
    let provider: BlogsAbilityFactory;
    let defaultRole: Role;
    let adminRole: Role;
    let superRole: Role;
    let user: User;
    let otherUser: User;
    let userBlog: Blog;
    let otherBlog: Blog;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BlogsAbilityFactory],
        }).compile();

        provider = module.get<BlogsAbilityFactory>(BlogsAbilityFactory);
    });
    beforeAll(() => {
        defaultRole = new Role();
        defaultRole.role_id = 1;
        defaultRole.name = "default";

        adminRole = new Role();
        adminRole.role_id = 2;
        adminRole.name = "admin";

        superRole = new Role();
        superRole.role_id = 3;
        superRole.name = "super admin";

        user = new User();
        user.user_id = 1;
        user.first_name = "khaled";
        user.last_name = "khaled";
        user.password = "12,3";
        user.user_name = "@khaled";
        user.role = defaultRole;

        otherUser = new User();
        otherUser.user_id = 2;
        otherUser.first_name = "khaled";
        otherUser.last_name = "khaled";
        otherUser.password = "12,3";
        otherUser.user_name = "@khaled2";
        otherUser.role = defaultRole;

        userBlog = new Blog();
        userBlog.blog_id = 1;
        userBlog.document = "bla bla ";
        userBlog.minute_to_read = 20;
        userBlog.title = "user blog";
        userBlog.sub_title = "sub for user blog";
        userBlog.deleted_at = null;
        userBlog.user = user;

        otherBlog = new Blog();
        otherBlog.blog_id = 2;
        otherBlog.document = "bla bla ";
        otherBlog.minute_to_read = 20;
        otherBlog.title = "other blog";
        otherBlog.sub_title = "sub for other blog";
        otherBlog.deleted_at = null;
        otherBlog.user = otherUser;
    });

    it("should be defined", () => {
        expect(provider).toBeDefined();
    });

    describe("default", () => {
        beforeAll(() => {
            user.role = defaultRole;
            otherUser.role = defaultRole;
        });
        it("allow user to read non deleted blog", () => {
            const ability = provider.createForUser(user);
            expect(ability.can(BlogAction.ReadBlog, Blog)).toBeTruthy();
            expect(ability.can(BlogAction.ReadBlog, userBlog)).toBeTruthy();
            expect(ability.can(BlogAction.ReadBlog, otherBlog)).toBeTruthy();
        });
        it("allow user to read his own deleted blog", () => {
            const ability = provider.createForUser(user);
            userBlog.deleted_at = new Date();
            expect(ability.can(BlogAction.ReadBlog, userBlog)).toBeTruthy();
            expect(ability.cannot(BlogAction.ReadBlog, userBlog)).toBeFalsy();
        });
        it("not allow user to read other deleted blog", () => {
            const ability = provider.createForUser(user);
            otherBlog.deleted_at = new Date();
            expect(ability.cannot(BlogAction.ReadBlog, otherBlog)).toBeTruthy();
            expect(ability.can(BlogAction.ReadBlog, otherBlog)).toBeFalsy();
        });

        it("not allow user to read deleted blog", () => {
            const ability = provider.createForUser(user);
            expect(
                ability.cannot(BlogAction.ReadDeletedBlog, Blog),
            ).toBeTruthy();
            expect(ability.can(BlogAction.ReadDeletedBlog, Blog)).toBeFalsy();
        });

        it("allow user to create blog", () => {
            const ability = provider.createForUser(user);
            expect(ability.can(BlogAction.CreateBlog, Blog)).toBeTruthy();
            expect(ability.cannot(BlogAction.CreateBlog, Blog)).toBeFalsy();
        });
        it("allow user to update blog", () => {
            const ability = provider.createForUser(user);
            expect(ability.can(BlogAction.UpdateBlog, Blog)).toBeTruthy();

            expect(ability.can(BlogAction.UpdateBlog, userBlog)).toBeTruthy();
            expect(ability.cannot(BlogAction.UpdateBlog, userBlog)).toBeFalsy();

            expect(ability.can(BlogAction.UpdateBlog, otherBlog)).toBeFalsy();
            expect(
                ability.cannot(BlogAction.UpdateBlog, otherBlog),
            ).toBeTruthy();
        });

        it("allow user to delete blog", () => {
            const ability = provider.createForUser(user);
            expect(ability.can(BlogAction.DeleteBlog, Blog)).toBeTruthy();

            expect(ability.can(BlogAction.DeleteBlog, userBlog)).toBeTruthy();
            expect(ability.cannot(BlogAction.DeleteBlog, userBlog)).toBeFalsy();

            expect(ability.can(BlogAction.DeleteBlog, otherBlog)).toBeFalsy();
            expect(
                ability.cannot(BlogAction.DeleteBlog, otherBlog),
            ).toBeTruthy();
        });
    });

    describe("admin", () => {
        beforeAll(() => {
            user.role = adminRole;
        });
        it("allow admin to read blog", () => {
            const ability = provider.createForUser(user);
            expect(ability.can(BlogAction.ReadBlog, Blog)).toBeTruthy();
            expect(ability.can(BlogAction.ReadBlog, userBlog)).toBeTruthy();
            expect(ability.can(BlogAction.ReadBlog, otherBlog)).toBeTruthy();
        });
        it("allow admin to read deleted blog", () => {
            const ability = provider.createForUser(user);
            expect(
                ability.cannot(BlogAction.ReadDeletedBlog, Blog),
            ).toBeFalsy();
            expect(ability.can(BlogAction.ReadDeletedBlog, Blog)).toBeTruthy();
        });

        it("not allow admin to create blog", () => {
            const ability = provider.createForUser(user);
            expect(ability.can(BlogAction.CreateBlog, Blog)).toBeFalsy();
            expect(ability.cannot(BlogAction.CreateBlog, Blog)).toBeTruthy();
        });
        it("not allow user to update blog", () => {
            const ability = provider.createForUser(user);
            expect(ability.can(BlogAction.UpdateBlog, Blog)).toBeFalsy();
        });

        it("allow admin to delete blog", () => {
            const ability = provider.createForUser(user);
            expect(ability.can(BlogAction.DeleteBlog, Blog)).toBeTruthy();

            expect(ability.can(BlogAction.DeleteBlog, userBlog)).toBeTruthy();
            expect(ability.cannot(BlogAction.DeleteBlog, userBlog)).toBeFalsy();

            expect(ability.can(BlogAction.DeleteBlog, otherBlog)).toBeTruthy();
            expect(
                ability.cannot(BlogAction.DeleteBlog, otherBlog),
            ).toBeFalsy();
        });
    });

    describe("super admin", () => {
        beforeAll(() => {
            user.role = superRole;
        });
        it("allow super admin to read blog", () => {
            const ability = provider.createForUser(user);
            expect(ability.can(BlogAction.ReadBlog, Blog)).toBeTruthy();
            expect(ability.can(BlogAction.ReadBlog, userBlog)).toBeTruthy();
            expect(ability.can(BlogAction.ReadBlog, otherBlog)).toBeTruthy();
        });
        it("allow super admin to read deleted blog", () => {
            const ability = provider.createForUser(user);
            expect(
                ability.cannot(BlogAction.ReadDeletedBlog, Blog),
            ).toBeFalsy();
            expect(ability.can(BlogAction.ReadDeletedBlog, Blog)).toBeTruthy();
        });

        it("not allow super admin to create blog", () => {
            const ability = provider.createForUser(user);
            expect(ability.can(BlogAction.CreateBlog, Blog)).toBeFalsy();
            expect(ability.cannot(BlogAction.CreateBlog, Blog)).toBeTruthy();
        });
        it("not allow super admin to update blog", () => {
            const ability = provider.createForUser(user);
            expect(ability.can(BlogAction.UpdateBlog, Blog)).toBeFalsy();
        });

        it("allow super admin to delete blog", () => {
            const ability = provider.createForUser(user);
            expect(ability.can(BlogAction.DeleteBlog, Blog)).toBeTruthy();

            expect(ability.can(BlogAction.DeleteBlog, userBlog)).toBeTruthy();
            expect(ability.cannot(BlogAction.DeleteBlog, userBlog)).toBeFalsy();

            expect(ability.can(BlogAction.DeleteBlog, otherBlog)).toBeTruthy();
            expect(
                ability.cannot(BlogAction.DeleteBlog, otherBlog),
            ).toBeFalsy();
        });
    });
});

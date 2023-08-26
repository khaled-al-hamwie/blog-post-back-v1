import { Test, TestingModule } from "@nestjs/testing";
import { Role } from "src/modules/roles/entities/role.entity";
import { User } from "src/modules/users/entities/user.entity";
// import { Blog } from "../entities/blog.entity";
import { Blog } from "src/modules/blogs/entities/blog.entity";
import { BlogAction } from "src/modules/blogs/enums/blogs.actions.enum";
import { CommentsAbilityFactory } from "./comments-ability.factory";

describe("Comments ability factory", () => {
    let provider: CommentsAbilityFactory;
    let defaultRole: Role;
    let adminRole: Role;
    let user: User;
    let otherUser: User;
    let userBlog: Blog;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CommentsAbilityFactory],
        }).compile();

        provider = module.get<CommentsAbilityFactory>(CommentsAbilityFactory);
    });
    beforeAll(() => {
        defaultRole = new Role();
        defaultRole.role_id = 1;
        defaultRole.name = "default";

        adminRole = new Role();
        adminRole.role_id = 2;
        adminRole.name = "admin";

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
    });

    it("should be defined", () => {
        expect(provider).toBeDefined();
    });

    describe("default", () => {
        beforeAll(() => {
            user.role = defaultRole;
            otherUser.role = defaultRole;
        });

        it("allow user to comment Blog", () => {
            const ability = provider.createForUser(user);
            expect(ability.can(BlogAction.CommentBlog, Blog)).toBeTruthy();
            expect(ability.cannot(BlogAction.CommentBlog, Blog)).toBeFalsy();

            expect(ability.can(BlogAction.CommentBlog, userBlog)).toBeTruthy();
            expect(
                ability.cannot(BlogAction.CommentBlog, userBlog),
            ).toBeFalsy();
        });
        // it("allow user to update blog", () => {
        //     const ability = provider.createForUser(user);
        //     expect(ability.can(BlogAction.UpdateBlog, Blog)).toBeTruthy();

        //     expect(ability.can(BlogAction.UpdateBlog, userBlog)).toBeTruthy();
        //     expect(ability.cannot(BlogAction.UpdateBlog, userBlog)).toBeFalsy();

        //     expect(ability.can(BlogAction.UpdateBlog, otherBlog)).toBeFalsy();
        //     expect(
        //         ability.cannot(BlogAction.UpdateBlog, otherBlog),
        //     ).toBeTruthy();
        // });

        // it("allow user to delete blog", () => {
        //     const ability = provider.createForUser(user);
        //     expect(ability.can(BlogAction.DeleteBlog, Blog)).toBeTruthy();

        //     expect(ability.can(BlogAction.DeleteBlog, userBlog)).toBeTruthy();
        //     expect(ability.cannot(BlogAction.DeleteBlog, userBlog)).toBeFalsy();

        //     expect(ability.can(BlogAction.DeleteBlog, otherBlog)).toBeFalsy();
        //     expect(
        //         ability.cannot(BlogAction.DeleteBlog, otherBlog),
        //     ).toBeTruthy();
        // });
    });

    describe("admin", () => {
        beforeAll(() => {
            user.role = adminRole;
        });

        it("admin can't comment", () => {
            const ability = provider.createForUser(user);
            expect(ability.can(BlogAction.CommentBlog, Blog)).toBeFalsy();
            expect(ability.cannot(BlogAction.CommentBlog, Blog)).toBeTruthy();

            expect(ability.can(BlogAction.CommentBlog, userBlog)).toBeFalsy();
            expect(
                ability.cannot(BlogAction.CommentBlog, userBlog),
            ).toBeTruthy();
        });
        // it("not allow user to update blog", () => {
        //     const ability = provider.createForUser(user);
        //     expect(ability.can(BlogAction.UpdateBlog, Blog)).toBeFalsy();
        // });

        // it("allow admin to delete blog", () => {
        //     const ability = provider.createForUser(user);
        //     expect(ability.can(BlogAction.DeleteBlog, Blog)).toBeTruthy();

        //     expect(ability.can(BlogAction.DeleteBlog, userBlog)).toBeTruthy();
        //     expect(ability.cannot(BlogAction.DeleteBlog, userBlog)).toBeFalsy();

        //     expect(ability.can(BlogAction.DeleteBlog, otherBlog)).toBeTruthy();
        //     expect(
        //         ability.cannot(BlogAction.DeleteBlog, otherBlog),
        //     ).toBeFalsy();
        // });
    });
});

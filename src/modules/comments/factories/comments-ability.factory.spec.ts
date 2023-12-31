import { Test, TestingModule } from "@nestjs/testing";
import { Role } from "src/modules/roles/entities/role.entity";
import { User } from "src/modules/users/entities/user.entity";
// import { Blog } from "../entities/blog.entity";
import { Blog } from "src/modules/blogs/entities/blog.entity";
import { BlogAction } from "src/modules/blogs/enums/blogs.actions.enum";
import { Comment } from "../entities/comment.entity";
import { CommentAction } from "../enums/comments.actions.enum";
import { CommentsAbilityFactory } from "./comments-ability.factory";

describe("Comments ability factory", () => {
    let provider: CommentsAbilityFactory;
    let defaultRole: Role;
    let adminRole: Role;
    let user: User;
    let otherUser: User;
    let thirdUser: User;
    let userBlog: Blog;
    let userComment: Comment;
    let otherComment: Comment;
    let thirdComment: Comment;
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

        thirdUser = new User();
        thirdUser.user_id = 3;
        thirdUser.first_name = "khaled";
        thirdUser.last_name = "khaled";
        thirdUser.password = "12,3";
        thirdUser.user_name = "@khaled3";
        thirdUser.role = defaultRole;

        userBlog = new Blog();
        userBlog.blog_id = 1;
        userBlog.document = "bla bla ";
        userBlog.minute_to_read = 20;
        userBlog.title = "user blog";
        userBlog.sub_title = "sub for user blog";
        userBlog.deleted_at = null;
        userBlog.user = user;

        userComment = new Comment();
        userComment.user = user;
        userComment.blog = userBlog;
        userComment.comment = "this is the user comment";

        otherComment = new Comment();
        otherComment.user = otherUser;
        otherComment.blog = userBlog;
        otherComment.comment = "this is the other user comment";

        thirdComment = new Comment();
        thirdComment.user = thirdUser;
        thirdComment.blog = userBlog;
        thirdComment.comment = "this is the third user comment";
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
        it("allow user to update his comment", () => {
            const ability = provider.createForUser(user);
            expect(
                ability.can(CommentAction.UpdateComment, Comment),
            ).toBeTruthy();

            expect(
                ability.can(CommentAction.UpdateComment, userComment),
            ).toBeTruthy();
            expect(
                ability.cannot(CommentAction.UpdateComment, userComment),
            ).toBeFalsy();

            expect(
                ability.can(CommentAction.UpdateComment, otherComment),
            ).toBeFalsy();
            expect(
                ability.cannot(CommentAction.UpdateComment, otherComment),
            ).toBeTruthy();
        });

        it("allow user to delete his comment", () => {
            const ability = provider.createForUser(user);
            expect(
                ability.can(CommentAction.DeleteComment, Comment),
            ).toBeTruthy();

            expect(
                ability.can(CommentAction.DeleteComment, userComment),
            ).toBeTruthy();
            expect(
                ability.cannot(CommentAction.DeleteComment, userComment),
            ).toBeFalsy();
        });
        it("user can't delete other comment", () => {
            const ability = provider.createForUser(otherUser);
            expect(
                ability.can(CommentAction.DeleteComment, Comment),
            ).toBeTruthy();
            expect(
                ability.can(CommentAction.DeleteComment, userComment),
            ).toBeFalsy();
            expect(
                ability.cannot(CommentAction.DeleteComment, userComment),
            ).toBeTruthy();

            expect(
                ability.can(CommentAction.DeleteComment, thirdComment),
            ).toBeFalsy();
            expect(
                ability.cannot(CommentAction.DeleteComment, thirdComment),
            ).toBeTruthy();
        });

        it("author can delete other comment", () => {
            const ability = provider.createForUser(user);

            expect(
                ability.can(CommentAction.DeleteComment, otherComment),
            ).toBeTruthy();
            expect(
                ability.cannot(CommentAction.DeleteComment, otherComment),
            ).toBeFalsy();
        });
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
        it("admin can't update comment", () => {
            const ability = provider.createForUser(user);
            expect(
                ability.can(CommentAction.UpdateComment, Comment),
            ).toBeFalsy();
        });

        it("admin can delete comment", () => {
            const ability = provider.createForUser(user);
            expect(
                ability.can(CommentAction.DeleteComment, Comment),
            ).toBeTruthy();

            expect(
                ability.can(CommentAction.DeleteComment, userComment),
            ).toBeTruthy();
            expect(
                ability.cannot(CommentAction.DeleteComment, userComment),
            ).toBeFalsy();
        });
    });
});

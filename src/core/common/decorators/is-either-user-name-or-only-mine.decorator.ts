import { ValidationOptions, registerDecorator } from "class-validator";
import { IsEitherUserNameOrOnlyMineConstraint } from "../validations-constraints/is-either-user-name-or-only-mine.constraint";

export function IsEitherUserNameOrOnlyMine(
    validationOptions?: ValidationOptions,
) {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEitherUserNameOrOnlyMineConstraint,
        });
    };
}

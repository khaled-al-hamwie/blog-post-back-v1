import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint()
export class IsEitherUserNameOrOnlyMineConstraint
    implements ValidatorConstraintInterface
{
    validate(value: any, args: ValidationArguments) {
        const object = args.object as any;
        return (
            (object.user_name && !object.only_mine) ||
            (!object.user_name && object.only_mine)
        );
    }
}

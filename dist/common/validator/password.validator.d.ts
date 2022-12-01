import { ValidatorConstraintInterface } from 'class-validator';
export declare class IsPasswordValid implements ValidatorConstraintInterface {
    validate(value: string): Promise<boolean>;
    defaultMessage(): string;
}

import { ValidatorConstraintInterface } from 'class-validator';
export declare class IsEmailValid implements ValidatorConstraintInterface {
    validate(value: string): Promise<boolean>;
    defaultMessage(): string;
}

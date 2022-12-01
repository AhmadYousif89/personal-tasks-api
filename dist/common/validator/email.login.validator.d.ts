import { ValidatorConstraintInterface } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ValidateEmailOnSignIn implements ValidatorConstraintInterface {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(value: string): Promise<boolean>;
    defaultMessage(): string;
}

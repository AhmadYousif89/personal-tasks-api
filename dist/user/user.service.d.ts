import { User } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { EditUserDto } from './dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    updateUserById(id: string, dto: EditUserDto): Promise<{}>;
    updateUserImage(id: string, image: string): Promise<{}>;
    deleteUserById(id: string): Promise<{
        message: string;
    }>;
    private deleteUserHash;
}

import { UserService } from './user.service';
import { EditUserDto } from './dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<import(".prisma/client").User[]>;
    getUserById(id: string): Promise<import(".prisma/client").User>;
    updateUserById(id: string, dto: EditUserDto): Promise<{}>;
    updateUserImage(id: string, image: string): Promise<{}>;
    deleteUserById(id: string): Promise<{
        message: string;
    }>;
}

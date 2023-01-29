import { PrismaService } from './../prisma/prisma.service';
import { EditTaskDto, TaskDto } from './dto';
export declare class TaskService {
    private prisma;
    constructor(prisma: PrismaService);
    createTask(userId: string, dto: TaskDto): Promise<import(".prisma/client").Task>;
    getAllTasks(userId: string): Promise<import(".prisma/client").Task[]>;
    getTaskById(userId: string, taskId: string): Promise<import(".prisma/client").Task>;
    updateTaskById(userId: string, taskId: string, dto: EditTaskDto): Promise<import(".prisma/client").Task>;
    deleteTaskById(userId: string, taskId: string): Promise<{
        id: string;
        message: string;
    }>;
    deleteActiveTasks(userId: string): Promise<{
        message: string;
    }>;
}

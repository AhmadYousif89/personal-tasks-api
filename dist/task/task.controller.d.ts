import { EditTaskDto, TaskDto } from './dto';
import { TaskService } from './task.service';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    createTask(id: string, dto: TaskDto): Promise<import(".prisma/client").Task>;
    getAllTasks(id: string): Promise<import(".prisma/client").Task[]>;
    getTaskById(id: string, taskId: string): Promise<import(".prisma/client").Task>;
    updateTaskById(id: string, dto: EditTaskDto, taskId: string): Promise<import(".prisma/client").Task>;
    deleteTaskById(id: string, taskId: string): Promise<{
        id: string;
        message: string;
    }>;
}

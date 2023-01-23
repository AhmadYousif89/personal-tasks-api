"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const prisma_service_1 = require("./../prisma/prisma.service");
const common_1 = require("@nestjs/common");
let TaskService = class TaskService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTask(userId, dto) {
        try {
            const task = await this.prisma.task.create({
                data: {
                    userId,
                    title: dto.title.trim(),
                    details: dto.details.trim(),
                    status: dto.status,
                    priority: dto.priority,
                    expireDate: dto.expireDate,
                },
            });
            return task;
        }
        catch (err) {
            throw err;
        }
    }
    async getAllTasks(userId) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (user && !user.refresh)
                throw new common_1.HttpException('Access denied, Deleted RT', common_1.HttpStatus.FORBIDDEN);
            const tasks = await this.prisma.task.findMany({
                where: { userId },
            });
            if (tasks.length === 0)
                throw new common_1.HttpException('Found no tasks', common_1.HttpStatus.NOT_FOUND);
            return tasks;
        }
        catch (err) {
            throw err;
        }
    }
    async getTaskById(userId, taskId) {
        try {
            const task = await this.prisma.task.findFirst({
                where: { userId, id: taskId },
            });
            if (!task)
                throw new common_1.HttpException('Task not found', common_1.HttpStatus.NOT_FOUND);
            return task;
        }
        catch (err) {
            throw err;
        }
    }
    async updateTaskById(userId, taskId, dto) {
        try {
            const task = await this.prisma.task.findUnique({
                where: { id: taskId },
            });
            if (!task)
                throw new common_1.HttpException('Task not found', common_1.HttpStatus.NOT_FOUND);
            if (task.userId !== userId) {
                throw new common_1.HttpException('Access denied to forbidden resource', common_1.HttpStatus.FORBIDDEN);
            }
            const updatedTask = await this.prisma.task.update({
                where: { id: taskId },
                data: Object.assign({}, dto),
            });
            return updatedTask;
        }
        catch (err) {
            throw err;
        }
    }
    async deleteTaskById(userId, taskId) {
        try {
            const task = await this.prisma.task.findUnique({
                where: { id: taskId },
            });
            if (!task)
                throw new common_1.HttpException('Task not found', common_1.HttpStatus.NOT_FOUND);
            if (task.userId !== userId) {
                throw new common_1.HttpException('Access denied to forbidden resource', common_1.HttpStatus.FORBIDDEN);
            }
            await this.prisma.task.delete({
                where: { id: taskId },
            });
            return { id: task.id, message: `Task deleted` };
        }
        catch (err) {
            throw err;
        }
    }
};
TaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map
import { PrismaService } from './../prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EditTaskDto, TaskDto } from './dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(userId: string, dto: TaskDto) {
    try {
      const task = await this.prisma.task.create({
        data: {
          userId,
          title: dto.title.trim(),
          details: dto.details.trim(),
          status: dto.status,
          priority: dto.priority,
        },
      });
      return task;
    } catch (err) {
      throw err;
    }
  }

  async getAllTasks(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user && !user.refresh)
        throw new HttpException(
          'Access denied, Deleted RT',
          HttpStatus.FORBIDDEN,
        );

      const tasks = await this.prisma.task.findMany({
        where: { userId },
      });
      if (tasks.length === 0)
        throw new HttpException('Found no tasks', HttpStatus.NOT_FOUND);

      return tasks;
    } catch (err) {
      throw err;
    }
  }

  async getTaskById(userId: string, taskId: string) {
    try {
      const task = await this.prisma.task.findFirst({
        where: { userId, id: taskId },
      });
      if (!task)
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);

      return task;
    } catch (err) {
      throw err;
    }
  }

  async updateTaskById(userId: string, taskId: string, dto: EditTaskDto) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!task)
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);

      if (task.userId !== userId) {
        throw new HttpException(
          'Access denied to forbidden resource',
          HttpStatus.FORBIDDEN,
        );
      }

      const updatedTask = await this.prisma.task.update({
        where: { id: taskId },
        data: { ...dto },
      });

      return updatedTask;
    } catch (err) {
      throw err;
    }
  }

  async deleteTaskById(userId: string, taskId: string) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!task)
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);

      if (task.userId !== userId) {
        throw new HttpException(
          'Access denied to forbidden resource',
          HttpStatus.FORBIDDEN,
        );
      }
      await this.prisma.task.delete({
        where: { id: taskId },
      });
      return { id: task.id, message: `Task deleted` };
    } catch (err) {
      throw err;
    }
  }
}

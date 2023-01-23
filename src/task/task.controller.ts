import {
  Res,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Controller,
} from '@nestjs/common';
import { Response } from 'express';
import { GetUserId, Protected } from '../common/decorators';
import { EditTaskDto, TaskDto } from './dto';
import { TaskService } from './task.service';

@Protected()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @Res() res: Response,
    @GetUserId() id: string,
    @Body() dto: TaskDto,
  ) {
    const task = await this.taskService.createTask(id, dto);
    return res.json(task);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllTasks(@GetUserId() id: string) {
    return this.taskService.getAllTasks(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getTaskById(@GetUserId() id: string, @Param('id') taskId: string) {
    return this.taskService.getTaskById(id, taskId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateTaskById(
    @GetUserId() id: string,
    @Body() dto: EditTaskDto,
    @Param('id') taskId: string,
  ) {
    return this.taskService.updateTaskById(id, taskId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteTaskById(@GetUserId() id: string, @Param('id') taskId: string) {
    return this.taskService.deleteTaskById(id, taskId);
  }
}

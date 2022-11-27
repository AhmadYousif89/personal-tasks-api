import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Controller,
} from '@nestjs/common';
import { GetUserId, Protected } from '../common/decorators';
import { EditTaskDto, TaskDto } from './dto';
import { TaskService } from './task.service';

@Protected()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('')
  createTask(@GetUserId() id: string, @Body() dto: TaskDto) {
    return this.taskService.createTask(id, dto);
  }

  @Get('')
  getAllTasks(@GetUserId() id: string) {
    return this.taskService.getAllTasks(id);
  }

  @Get(':id')
  getTaskById(@GetUserId() id: string, @Param('id') taskId: string) {
    return this.taskService.getTaskById(id, taskId);
  }

  @Patch(':id')
  updateTaskById(
    @GetUserId() id: string,
    @Body() dto: EditTaskDto,
    @Param('id') taskId: string,
  ) {
    return this.taskService.updateTaskById(id, taskId, dto);
  }

  @Delete(':id')
  deleteTaskById(@GetUserId() id: string, @Param('id') taskId: string) {
    return this.taskService.deleteTaskById(id, taskId);
  }
}

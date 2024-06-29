import {
  Controller,
  Post,
  Put,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../users/user.entity';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createTask(@Body() taskData: Partial<Task>, @Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.create(taskData, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getTasksForUser(@Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.findAllForUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('date')
  async getTasksForDate(@Body('date') date: string, @Req() req: Request) {
    const user = req.user as User;
    const parsedDate = new Date(date);
    return this.tasksService.findForUserByDate(user, parsedDate);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateTaskStatus(
    @Param('id') id: number,
    @Body() payload: any,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    const parsedDate = new Date(payload.date);
    return this.tasksService.updateStatus(id, payload.status, user, parsedDate);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTask(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as User;
    return this.tasksService.deleteTask(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTasks() {
    return this.tasksService.findAll();
  }
}

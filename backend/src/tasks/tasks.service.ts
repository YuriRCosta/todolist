import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskCompletionLog } from './task_completion_log.entity';
import { User } from '../users/user.entity';
import { isTaskForDate } from './tasks.util';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(TaskCompletionLog)
    private taskCompletionLogRepository: Repository<TaskCompletionLog>,
  ) {}

  async create(taskData: Partial<Task>, user: User): Promise<Task> {
    const task = this.tasksRepository.create({
      ...taskData,
      user,
      status: 'To-do',
    });
    return this.tasksRepository.save(task);
  }

  async findAllForUser(user: User): Promise<Task[]> {
    return this.tasksRepository.find({ where: { user } });
  }

  async findForUserByDate(user: User, date: Date): Promise<Task[]> {
    const tasks = await this.findAllForUser(user);

    for (const task of tasks) {
      const log = await this.taskCompletionLogRepository.findOne({
        where: {
          task_id: task.id,
          completion_date: date,
        },
        order: {
          created_at: 'DESC',
        },
      });

      if (!log) {
        task.status = 'To-do';
      } else {
        task.status = log.status;
      }
    }

    return tasks.filter((task) => isTaskForDate(task, date));
  }

  async updateStatus(
    id: number,
    status: string,
    user: User,
    date: Date,
  ): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id, user } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const log = await this.taskCompletionLogRepository.findOne({
      where: {
        task,
        completion_date: date,
      },
    });

    if (log) {
      log.status = status;
      await this.taskCompletionLogRepository.save(log);
    } else {
      const newLog = this.taskCompletionLogRepository.create({
        task,
        task_id: id,
        completion_date: date,
        status,
        user,
      });
      await this.taskCompletionLogRepository.save(newLog);
    }

    return task;
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const task = await this.tasksRepository.findOne({ where: { id, user } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.tasksRepository.remove(task);
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';

@Entity()
export class TaskCompletionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.completionLogs, { onDelete: 'CASCADE' })
  task: Task;

  @Column({ nullable: true })
  task_id: number;

  @Column()
  completion_date: Date;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @CreateDateColumn()
  created_at: Date;
}

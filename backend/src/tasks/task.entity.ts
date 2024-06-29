import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { TaskCompletionLog } from './task_completion_log.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  recurrence: string;

  @Column({ nullable: true })
  specificDate: Date;

  @Column({ nullable: true })
  dayOfWeek: number;

  @Column({ nullable: true })
  dayOfMonth: number;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @OneToMany(() => TaskCompletionLog, (log) => log.task)
  completionLogs: TaskCompletionLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

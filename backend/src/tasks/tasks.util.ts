import { Task } from './task.entity';
import * as moment from 'moment';

export function isTaskForDate(task: Task, date: Date): boolean {
  const inputDate = moment(date).utc(false).startOf('day');

  if (task.specificDate) {
    const taskDate = moment(task.specificDate).utc(false).startOf('day');
    return taskDate.isSame(inputDate);
  }

  const taskCreatedDate = moment(task.createdAt).startOf('day');

  switch (task.recurrence) {
    case 'daily':
      return true;
    case 'weekly':
      if (task.dayOfWeek !== undefined) {
        return inputDate.day() === task.dayOfWeek;
      }
      return taskCreatedDate.day() === inputDate.day();
    case 'monthly':
      if (task.dayOfMonth !== undefined) {
        return inputDate.date() === task.dayOfMonth;
      }
      return taskCreatedDate.date() === inputDate.date();
    default:
      return taskCreatedDate.isSame(inputDate);
  }
}

import { startOfQuarter, endOfQuarter, eachDayOfInterval, isSameDay, isWeekend } from 'date-fns';
import { WorkStatus } from '../types/calendar';
import { getNationalHolidays, getMadridHolidays } from './holidays';

export interface QuarterStats {
  totalWorkDays: number;
  remoteDays: number;
  percentage: number;
}

export const getDetailedQuarterStats = (date: Date, dayStatuses: Map<string, WorkStatus>): QuarterStats => {
  const year = date.getFullYear();
  const holidays = [...getNationalHolidays(year), ...getMadridHolidays(year)];
  const quarterStart = startOfQuarter(date);
  const quarterEnd = endOfQuarter(date);
  
  const workDays = eachDayOfInterval({ start: quarterStart, end: quarterEnd })
    .filter(date => !isWeekend(date) && !holidays.some(holiday => isSameDay(date, holiday)));
  
  const remoteDays = workDays.filter(date => {
    const dateKey = date.toISOString().split('T')[0];
    return dayStatuses.get(dateKey) === 'remote';
  }).length;

  const totalWorkDays = workDays.length;
  const percentage = totalWorkDays > 0 ? (remoteDays / totalWorkDays) * 100 : 0;

  return {
    totalWorkDays,
    remoteDays,
    percentage
  };
};
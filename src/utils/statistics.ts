import { startOfQuarter, endOfQuarter, eachDayOfInterval, isSameDay, isWeekend, format, getQuarter } from 'date-fns';
import { WorkStatus } from '../types/calendar';
import { getNationalHolidays, getMadridHolidays } from './holidays';

export const getQuarterStats = (date: Date, dayStatuses: Map<string, WorkStatus>): number => {
  const year = date.getFullYear();
  const quarter = getQuarter(date);
  const holidays = [...getNationalHolidays(year), ...getMadridHolidays(year)];

  const startDate = startOfQuarter(date);
  const endDate = endOfQuarter(date);
  
  const workDays = eachDayOfInterval({ start: startDate, end: endDate })
    .filter(date => !isWeekend(date) && !holidays.some(holiday => isSameDay(date, holiday)));
  
  const remoteDays = workDays.filter(date => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return dayStatuses.get(dateKey) === 'remote';
  }).length;

  return workDays.length > 0 ? (remoteDays / workDays.length) * 100 : 0;
};
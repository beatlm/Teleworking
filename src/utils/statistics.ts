import { startOfQuarter, endOfQuarter, eachDayOfInterval, isSameDay, isWeekend } from 'date-fns';
import { WorkStatus } from '../types/calendar';
import { getNationalHolidays, getMadridHolidays } from './holidays';

export const getQuarterlyRemoteStats = (dayStatuses: Map<string, WorkStatus>): Record<number, number> => {
  const currentYear = new Date().getFullYear();
  const quarters = [1, 2, 3, 4];
  const holidays = [...getNationalHolidays(currentYear), ...getMadridHolidays(currentYear)];

  return quarters.reduce((acc, quarter) => {
    const startDate = startOfQuarter(new Date(currentYear, (quarter - 1) * 3, 1));
    const endDate = endOfQuarter(startDate);
    
    const workDays = eachDayOfInterval({ start: startDate, end: endDate })
      .filter(date => !isWeekend(date) && !holidays.some(holiday => isSameDay(date, holiday)));
    
    const remoteDays = workDays.filter(date => 
      dayStatuses.get(date.toISOString()) === 'remote'
    ).length;

    acc[quarter] = workDays.length > 0 ? (remoteDays / workDays.length) * 100 : 0;
    return acc;
  }, {} as Record<number, number>);
};
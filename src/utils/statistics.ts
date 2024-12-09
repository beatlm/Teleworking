import { startOfQuarter, endOfQuarter, eachDayOfInterval, isSameDay, isWeekend, format, getQuarter, startOfWeek, endOfWeek } from 'date-fns';
import { WorkStatus } from '../types/calendar';
import { getNationalHolidays, getMadridHolidays } from './holidays';

const getQuarterBoundaries = (date: Date): { start: Date; end: Date } => {
  const quarterStart = startOfQuarter(date);
  const quarterEnd = endOfQuarter(date);
  
  // Adjust start to previous Monday if quarter doesn't start on Monday
  const adjustedStart = startOfWeek(quarterStart, { weekStartsOn: 1 });
  // Adjust end to next Sunday if quarter doesn't end on Sunday
  const adjustedEnd = endOfWeek(quarterEnd, { weekStartsOn: 1 });
  
  return {
    start: adjustedStart,
    end: adjustedEnd
  };
};

export const getQuarterStats = (date: Date, dayStatuses: Map<string, WorkStatus>): number => {
  const year = date.getFullYear();
  const holidays = [...getNationalHolidays(year), ...getMadridHolidays(year)];
  const { start, end } = getQuarterBoundaries(date);
  
  const workDays = eachDayOfInterval({ start, end })
    .filter(date => {
      // Only count days within the actual quarter (not the extended week boundaries)
      const actualQuarterStart = startOfQuarter(date);
      const actualQuarterEnd = endOfQuarter(date);
      const isInQuarter = date >= actualQuarterStart && date <= actualQuarterEnd;
      
      return isInQuarter && 
             !isWeekend(date) && 
             !holidays.some(holiday => isSameDay(date, holiday));
    });
  
  const remoteDays = workDays.filter(date => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return dayStatuses.get(dateKey) === 'remote';
  }).length;

  return workDays.length > 0 ? (remoteDays / workDays.length) * 100 : 0;
};
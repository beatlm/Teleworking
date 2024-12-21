import { isWeekend } from 'date-fns';
import { WorkStatus, DayStatus } from '../types/calendar';
import { getNationalHolidays, getMadridHolidays } from './holidays';

export const getDayStatusInfo = (date: Date, status: WorkStatus): DayStatus => {
  const year = date.getFullYear();
  const nationalHolidays = getNationalHolidays(year);
  const madridHolidays = getMadridHolidays(year);
  
  const isHoliday = [...nationalHolidays, ...madridHolidays].some(
    holiday => 
      holiday.getFullYear() === date.getFullYear() &&
      holiday.getMonth() === date.getMonth() &&
      holiday.getDate() === date.getDate()
  );

  return {
    date,
    status: isHoliday ? 'holiday' : status,
    isWeekend: isWeekend(date),
    isHoliday
  };
};
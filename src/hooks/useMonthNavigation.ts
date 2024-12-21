import { useCallback } from 'react';
import { addMonths, subMonths } from 'date-fns';

export const useMonthNavigation = (
  currentDate: Date,
  onDateChange: (date: Date) => Promise<void>
) => {
  const nextMonth = useCallback(async () => {
    const newDate = addMonths(currentDate, 1);
    await onDateChange(newDate);
  }, [currentDate, onDateChange]);

  const previousMonth = useCallback(async () => {
    const newDate = subMonths(currentDate, 1);
    await onDateChange(newDate);
  }, [currentDate, onDateChange]);

  return { nextMonth, previousMonth };
};
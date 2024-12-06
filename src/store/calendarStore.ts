import { create } from 'zustand';
import { addMonths, subMonths, startOfMonth, isSameDay, isWeekend } from 'date-fns';
import { WorkStatus, DayStatus } from '../types/calendar';
import { getNationalHolidays, getMadridHolidays } from '../utils/holidays';

interface CalendarState {
  currentDate: Date;
  dayStatuses: Map<string, WorkStatus>;
  nextMonth: () => void;
  previousMonth: () => void;
  setDayStatus: (date: Date, status: WorkStatus) => void;
  getDayStatus: (date: Date) => DayStatus;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  currentDate: startOfMonth(new Date()),
  dayStatuses: new Map(),

  nextMonth: () => set((state) => ({ 
    currentDate: addMonths(state.currentDate, 1) 
  })),

  previousMonth: () => set((state) => ({ 
    currentDate: subMonths(state.currentDate, 1) 
  })),

  setDayStatus: (date: Date, status: WorkStatus) => 
    set((state) => ({
      dayStatuses: new Map(state.dayStatuses).set(date.toISOString(), status)
    })),

  getDayStatus: (date: Date) => {
    const { dayStatuses } = get();
    const nationalHolidays = getNationalHolidays(date.getFullYear());
    const madridHolidays = getMadridHolidays(date.getFullYear());
    
    const isHoliday = [...nationalHolidays, ...madridHolidays]
      .some(holiday => isSameDay(date, holiday));

    return {
      date,
      status: dayStatuses.get(date.toISOString()) || 'office',
      isWeekend: isWeekend(date),
      isHoliday
    };
  }
}));
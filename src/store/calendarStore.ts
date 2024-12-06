import { create } from 'zustand';
import { addMonths, subMonths, startOfMonth, isSameDay, isWeekend } from 'date-fns';
import { WorkStatus, DayStatus } from '../types/calendar';
import { getNationalHolidays, getMadridHolidays } from '../utils/holidays';
import { supabase, DayStatusRecord } from '../lib/supabase';

interface CalendarState {
  currentDate: Date;
  dayStatuses: Map<string, WorkStatus>;
  isLoading: boolean;
  error: string | null;
  nextMonth: () => void;
  previousMonth: () => void;
  setDayStatus: (date: Date, status: WorkStatus) => Promise<void>;
  getDayStatus: (date: Date) => DayStatus;
  fetchDayStatuses: () => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  currentDate: startOfMonth(new Date()),
  dayStatuses: new Map(),
  isLoading: false,
  error: null,

  nextMonth: () => set((state) => ({ 
    currentDate: addMonths(state.currentDate, 1) 
  })),

  previousMonth: () => set((state) => ({ 
    currentDate: subMonths(state.currentDate, 1) 
  })),

  setDayStatus: async (date: Date, status: WorkStatus) => {
    try {
      set({ isLoading: true, error: null });
      const dateStr = date.toISOString();

      const { error } = await supabase
        .from('day_statuses')
        .upsert({
          date: dateStr,
          status: status
        }, {
          onConflict: 'date'
        });

      if (error) throw error;

      set((state) => ({
        dayStatuses: new Map(state.dayStatuses).set(dateStr, status),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false 
      });
    }
  },

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
  },

  fetchDayStatuses: async () => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from('day_statuses')
        .select('*');

      if (error) throw error;

      const statusMap = new Map<string, WorkStatus>();
      (data as DayStatusRecord[]).forEach(record => {
        statusMap.set(record.date, record.status as WorkStatus);
      });

      set({ 
        dayStatuses: statusMap,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false 
      });
    }
  }
}));
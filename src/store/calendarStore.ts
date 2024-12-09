import { create } from 'zustand';
import { addMonths, subMonths, startOfMonth, isSameDay, isWeekend, startOfYear, endOfYear, format } from 'date-fns';
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
      const dateStr = format(date, 'yyyy-MM-dd');

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
      console.error('Error setting day status:', error);
    }
  },

  getDayStatus: (date: Date) => {
    const { dayStatuses } = get();
    const nationalHolidays = getNationalHolidays(date.getFullYear());
    const madridHolidays = getMadridHolidays(date.getFullYear());
    
    const isHoliday = [...nationalHolidays, ...madridHolidays]
      .some(holiday => isSameDay(date, holiday));

    const dateStr = format(date, 'yyyy-MM-dd');
    const status = dayStatuses.get(dateStr);

    return {
      date,
      status: status || 'office',
      isWeekend: isWeekend(date),
      isHoliday
    };
  },

  fetchDayStatuses: async () => {
    try {
      set({ isLoading: true, error: null });

      const startDate = format(startOfYear(new Date()), 'yyyy-MM-dd');
      const endDate = format(endOfYear(new Date()), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('day_statuses')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

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
      console.error('Error fetching day statuses:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isLoading: false 
      });
    }
  }
}));
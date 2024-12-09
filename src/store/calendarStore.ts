import { create } from 'zustand';
import { addMonths, subMonths, startOfMonth, isSameDay, isWeekend, startOfYear, endOfYear, format } from 'date-fns';
import { WorkStatus, DayStatus } from '../types/calendar';
import { getNationalHolidays, getMadridHolidays } from '../utils/holidays';
import { supabase, DayStatusRecord, formatDateForDB, parseDateFromDB } from '../lib/supabase';

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
      const formattedDate = formatDateForDB(date);

      const { error: upsertError } = await supabase
        .from('day_statuses')
        .upsert({
          date: formattedDate,
          status: status
        }, {
          onConflict: 'date'
        });

      if (upsertError) throw upsertError;

      const dateKey = format(date, 'yyyy-MM-dd');
      set((state) => ({
        dayStatuses: new Map(state.dayStatuses).set(dateKey, status),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al actualizar el estado del día',
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

    const dateKey = format(date, 'yyyy-MM-dd');
    const status = dayStatuses.get(dateKey);

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

      const startDate = formatDateForDB(startOfYear(new Date()));
      const endDate = formatDateForDB(endOfYear(new Date()));

      const { data, error } = await supabase
        .from('day_statuses')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;

      const statusMap = new Map<string, WorkStatus>();
      (data as DayStatusRecord[]).forEach(record => {
        const dateKey = format(parseDateFromDB(record.date), 'yyyy-MM-dd');
        statusMap.set(dateKey, record.status as WorkStatus);
      });

      set({ 
        dayStatuses: statusMap,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching day statuses:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar los datos',
        isLoading: false 
      });
    }
  }
}));
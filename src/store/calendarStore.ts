import { create } from 'zustand';
import { startOfMonth, startOfYear, endOfYear } from 'date-fns';
import { WorkStatus, DayStatus } from '../types/calendar';
import { getDayStatusInfo } from '../utils/dayStatus';
import { getDateKey } from '../utils/dateFormatters';
import { fetchDayStatuses, updateDayStatus } from '../services/dayStatusService';

interface CalendarState {
  currentDate: Date;
  dayStatuses: Map<string, WorkStatus>;
  isLoading: boolean;
  error: string | null;
  setCurrentDate: (date: Date) => Promise<void>;
  setDayStatus: (date: Date, status: WorkStatus) => Promise<void>;
  getDayStatus: (date: Date) => DayStatus;
  fetchCurrentYearStatuses: () => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  currentDate: startOfMonth(new Date()),
  dayStatuses: new Map(),
  isLoading: false,
  error: null,

  setCurrentDate: async (date: Date) => {
    set({ currentDate: date });
    await get().fetchCurrentYearStatuses();
  },

  setDayStatus: async (date: Date, status: WorkStatus) => {
    try {
      set({ isLoading: true, error: null });
      await updateDayStatus(date, status);
      
      const dateKey = getDateKey(date);
      set(state => ({
        dayStatuses: new Map(state.dayStatuses).set(dateKey, status),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error al actualizar el estado del día',
        isLoading: false 
      });
    }
  },

  getDayStatus: (date: Date) => {
    const { dayStatuses } = get();
    const dateKey = getDateKey(date);
    const status = dayStatuses.get(dateKey) || 'office';
    return getDayStatusInfo(date, status);
  },

  fetchCurrentYearStatuses: async () => {
    try {
      set({ isLoading: true, error: null });
      const { currentDate } = get();
      const statusMap = await fetchDayStatuses(currentDate.getFullYear());
      set({ dayStatuses: statusMap, isLoading: false });
    } catch (error) {
      console.error('Error fetching day statuses:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar los datos',
        isLoading: false 
      });
    }
  }
}));
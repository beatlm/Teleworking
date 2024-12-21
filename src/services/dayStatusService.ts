import { startOfYear, endOfYear } from 'date-fns';
import { supabase, DayStatusRecord } from '../lib/supabase';
import { WorkStatus } from '../types/calendar';
import { formatDateForDB, getDateKey } from '../utils/dateFormatters';

export const fetchDayStatuses = async (year: number): Promise<Map<string, WorkStatus>> => {
  const startDate = formatDateForDB(startOfYear(new Date(year, 0)));
  const endDate = formatDateForDB(endOfYear(new Date(year, 0)));

  try {
    const { data, error } = await supabase
      .from('day_statuses')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    const statusMap = new Map<string, WorkStatus>();
    (data as DayStatusRecord[]).forEach(record => {
      const dateKey = getDateKey(new Date(record.date));
      statusMap.set(dateKey, record.status as WorkStatus);
    });

    return statusMap;
  } catch (error) {
    console.error('Error fetching day statuses:', error);
    throw error;
  }
};

export const updateDayStatus = async (
  date: Date,
  status: WorkStatus
): Promise<void> => {
  const dateStr = formatDateForDB(date);

  try {
    const { error } = await supabase
      .from('day_statuses')
      .upsert({
        date: dateStr,
        status: status
      }, {
        onConflict: 'date'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating day status:', error);
    throw error;
  }
};
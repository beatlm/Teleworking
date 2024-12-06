import React, { useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarStore } from '../store/calendarStore';
import { CalendarDay } from './CalendarDay';
import { QuarterlyStats } from './QuarterlyStats';

export const Calendar: React.FC = () => {
  const { currentDate, nextMonth, previousMonth, fetchDayStatuses, isLoading, error } = useCalendarStore();

  useEffect(() => {
    fetchDayStatuses();
  }, [fetchDayStatuses]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = eachDayOfInterval({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6)
  });

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {isLoading && (
        <div className="text-center text-gray-600 mb-4">
          Cargando...
        </div>
      )}
      
      <QuarterlyStats />
      
      <div className="flex items-center justify-between mb-8 mt-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
          disabled={isLoading}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
          disabled={isLoading}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className="text-center font-semibold text-gray-600"
          >
            {format(day, 'EEEEEE', { locale: es }).toUpperCase()}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <CalendarDay key={day.toString()} date={day} />
        ))}
      </div>
    </div>
  );
};
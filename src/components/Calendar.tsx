import React, { useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, getQuarter } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useCalendarStore } from '../store/calendarStore';
import { useMonthNavigation } from '../hooks/useMonthNavigation';
import { CalendarDay } from './CalendarDay';
import { getDetailedQuarterStats } from '../utils/statistics';

export const Calendar: React.FC = () => {
  const { currentDate, setCurrentDate, isLoading, error, fetchCurrentYearStatuses, dayStatuses } = useCalendarStore();
  const { nextMonth, previousMonth } = useMonthNavigation(currentDate, setCurrentDate);

  useEffect(() => {
    fetchCurrentYearStatuses();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = eachDayOfInterval({
    start: calendarStart,
    end: endOfWeek(calendarStart, { weekStartsOn: 1 })
  });

  const stats = getDetailedQuarterStats(currentDate, dayStatuses);

  const currentQuarter = getQuarter(currentDate);

  if (error) {
    return (
      <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg">
        <p className="font-semibold">Error al cargar los datos</p>
        <p className="text-sm mt-2">{error}</p>
        <button 
          onClick={() => fetchCurrentYearStatuses()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-gray-700">Cargando datos...</span>
          </div>
        </div>
      )}
            
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={isLoading}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-semibold capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {currentQuarter}º Trimestre
          </p>
          <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, stats.percentage))}%` }}
            />
          <span className="text-sm font-medium text-gray-600 min-w-[3.5rem]">
            {stats.percentage.toFixed(1)}%
          </span>
          
        </div>
       
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
          <CalendarDay 
            key={day.toString()} 
            date={day}
            isOutsideMonth={!isSameMonth(day, currentDate)}
          />
        ))}
      </div>
    </div>
  );
};
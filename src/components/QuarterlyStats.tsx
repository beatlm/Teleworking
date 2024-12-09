import React from 'react';
import { useCalendarStore } from '../store/calendarStore';
import { getQuarterStats } from '../utils/statistics';
import { getQuarter, format } from 'date-fns';
import { es } from 'date-fns/locale';

export const QuarterlyStats: React.FC = () => {
  const { dayStatuses, currentDate } = useCalendarStore();
  const quarter = getQuarter(currentDate);
  const percentage = getQuarterStats(currentDate, dayStatuses);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Teletrabajo {quarter}º Trimestre {format(currentDate, 'yyyy', { locale: es })}
      </h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600 min-w-[3.5rem]">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};
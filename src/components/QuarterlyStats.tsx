import React from 'react';
import { useCalendarStore } from '../store/calendarStore';
import { getQuarterlyRemoteStats } from '../utils/statistics';

export const QuarterlyStats: React.FC = () => {
  const { dayStatuses } = useCalendarStore();
  const stats = getQuarterlyRemoteStats(dayStatuses);

  return (
    <div className="grid grid-cols-4 gap-4">
      {Object.entries(stats).map(([quarter, percentage]) => (
        <div
          key={quarter}
          className="bg-white p-4 rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-700">
            {quarter}º Trimestre
          </h3>
          <div className="mt-2">
            <div className="flex items-center">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">
                {percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
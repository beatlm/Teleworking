import React from 'react';
import { format, isSameMonth } from 'date-fns';
import { useCalendarStore } from '../store/calendarStore';
import { WorkStatus } from '../types/calendar';
import { Home, Computer, Sun } from 'lucide-react';

interface CalendarDayProps {
  date: Date;
}

const getBackgroundColor = (status: WorkStatus, isWeekend: boolean, isHoliday: boolean): string => {
  if (isWeekend || isHoliday) return 'bg-green-200 hover:bg-green-300';
  switch (status) {
    case 'office':
      return 'bg-red-200 hover:bg-red-300';
    case 'remote':
      return 'bg-blue-200 hover:bg-blue-300';
    case 'vacation':
      return 'bg-yellow-200 hover:bg-yellow-300';
    default:
      return 'bg-white hover:bg-gray-100';
  }
};

const StatusIcon: React.FC<{ status: WorkStatus }> = ({ status }) => {
  switch (status) {
    case 'remote':
      return <Home className="w-5 h-5 text-blue-600" />;
    case 'office':
      return <Computer className="w-5 h-5 text-red-600" />;
    case 'vacation':
      return <Sun className="w-5 h-5 text-yellow-600" />;
    default:
      return null;
  }
};

export const CalendarDay: React.FC<CalendarDayProps> = ({ date }) => {
  const { currentDate, getDayStatus, setDayStatus } = useCalendarStore();
  const { status, isWeekend, isHoliday } = getDayStatus(date);
  
  const isCurrentMonth = isSameMonth(date, currentDate);
  const dayNumber = format(date, 'd');

  const handleStatusChange = () => {
    if (isWeekend || isHoliday) return;
    const statusOrder: WorkStatus[] = ['office', 'remote', 'vacation', 'holiday'];
    const currentIndex = statusOrder.indexOf(status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    setDayStatus(date, nextStatus);
  };

  if (!isCurrentMonth) {
    return <div className="h-24 bg-gray-50 rounded-lg"></div>;
  }

  const backgroundColor = getBackgroundColor(status, isWeekend, isHoliday);

  return (
    <button
      onClick={handleStatusChange}
      disabled={isWeekend || isHoliday}
      className={`
        h-24 p-2 rounded-lg flex flex-col items-center justify-start gap-2
        ${backgroundColor}
        transition-colors duration-200
      `}
    >
      <span className="text-sm font-semibold text-gray-800">
        {dayNumber}
      </span>
      {!isWeekend && !isHoliday && <StatusIcon status={status} />}
    </button>
  );
};
export type WorkStatus = 'office' | 'remote' | 'holiday' | 'vacation';

export interface DayStatus {
  date: Date;
  status: WorkStatus;
  isWeekend: boolean;
  isHoliday: boolean;
}
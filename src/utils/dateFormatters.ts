export const formatDateForDB = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  export const getDateKey = (date: Date): string => {
    return formatDateForDB(date);
  };
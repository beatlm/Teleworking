import { getYear } from 'date-fns';

export const getNationalHolidays = (year: number = getYear(new Date())): Date[] => {
  return [
    new Date(year, 0, 1),  // Año Nuevo
    new Date(year, 0, 6),  // Reyes Magos
    new Date(year, 3, 19), // Viernes Santo
    new Date(year, 4, 1),  // Día del Trabajo
    new Date(year, 7, 15), // Asunción de la Virgen
    new Date(year, 9, 12), // Fiesta Nacional
    new Date(year, 10, 1), // Todos los Santos
    new Date(year, 11, 6), // Día de la Constitución
    new Date(year, 11, 8), // Inmaculada Concepción
    new Date(year, 11, 25) // Navidad
  ];
};

export const getMadridHolidays = (year: number = getYear(new Date())): Date[] => {
  return [
    new Date(year, 4, 2),  // Día de la Comunidad de Madrid
    new Date(year, 4, 15), // San Isidro
    new Date(year, 10, 9)  // Almudena
  ];
};
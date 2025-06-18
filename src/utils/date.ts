import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const getBrazilDateTime = () => {
  const date = new Date();
  const brazilDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  
  return {
    date: brazilDate,
    formatted: format(brazilDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    shortFormatted: format(brazilDate, 'dd/MM/yyyy'),
    dayOfWeek: format(brazilDate, 'EEEE', { locale: ptBR }),
    time: format(brazilDate, 'HH:mm')
  };
};
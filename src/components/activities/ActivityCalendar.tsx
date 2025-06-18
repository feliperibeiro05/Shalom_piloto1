import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivities } from '../../contexts/ActivitiesContext';

export const ActivityCalendar: React.FC = () => {
  const { getActivitiesByDate } = useActivities();
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const getDaysInMonth = (month: number, year: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay();
    
    // Add days from previous month to fill the first week
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    
    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDate = new Date(prevYear, prevMonth, daysInPrevMonth - i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Add days of current month
    while (date.getMonth() === month) {
      days.push({ date: new Date(date), isCurrentMonth: true });
      date.setDate(date.getDate() + 1);
    }
    
    // Add days from next month to complete the last week
    const lastDay = days[days.length - 1].date.getDay();
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    for (let i = 1; i < 7 - lastDay; i++) {
      const nextDate = new Date(nextYear, nextMonth, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const monthDays = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getActivityCount = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const activities = getActivitiesByDate(dateString);
    return activities.length;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      work: 'bg-blue-500',
      health: 'bg-green-500',
      study: 'bg-purple-500',
      personal: 'bg-yellow-500',
      finance: 'bg-red-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const today = new Date();

  return (
    <div className="space-y-4">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium text-white">
            {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentDate)}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </button>
          <button 
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Grid do Calendário */}
      <div className="grid grid-cols-7 gap-1">
        {/* Dias da Semana */}
        {days.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}

        {/* Dias do Mês */}
        {monthDays.map(({ date, isCurrentMonth }, index) => {
          const isToday = date.getDate() === today.getDate() && 
                         date.getMonth() === today.getMonth() && 
                         date.getFullYear() === today.getFullYear();
          const isSelected = selectedDate?.getTime() === date.getTime();
          const dateString = date.toISOString().split('T')[0];
          const activities = getActivitiesByDate(dateString);
          const activityCount = activities.length;

          return (
            <div
              key={index}
              onClick={() => setSelectedDate(isSelected ? null : date)}
              className={`
                relative aspect-square p-2 rounded-lg border cursor-pointer
                transition-all duration-200
                ${isSelected ? 'bg-blue-500/20 border-blue-500' : 
                  isToday ? 'bg-purple-500/20 border-purple-500' : 
                  isCurrentMonth ? 'border-gray-700 hover:bg-gray-800/50' :
                  'border-gray-800 bg-gray-900/50 opacity-50'}
              `}
            >
              <span className={`text-sm ${
                isToday ? 'text-purple-500 font-medium' : 
                isSelected ? 'text-blue-500 font-medium' : 
                isCurrentMonth ? 'text-gray-300' :
                'text-gray-500'
              }`}>
                {date.getDate()}
              </span>
              
              {activityCount > 0 && (
                <div className="absolute bottom-1 right-1 flex -space-x-1">
                  {activities.slice(0, 3).map((activity, i) => (
                    <div
                      key={activity.id}
                      className={`w-2 h-2 rounded-full ${getCategoryColor(activity.category)}`}
                    />
                  ))}
                  {activityCount > 3 && (
                    <div className="w-2 h-2 rounded-full bg-gray-500 flex items-center justify-center">
                      <span className="text-[8px] text-white">+</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tooltip com detalhes das atividades */}
              <AnimatePresence>
                {isSelected && activities.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 top-full mt-2 z-10 w-64 bg-gray-800 rounded-lg shadow-lg p-3"
                  >
                    <div className="space-y-2">
                      {activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getCategoryColor(activity.category)}`} />
                            <span className="text-gray-200">{activity.title}</span>
                          </div>
                          <span className="text-gray-400">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
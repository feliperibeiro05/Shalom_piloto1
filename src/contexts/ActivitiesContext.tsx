import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'goal' | 'daily' | 'routine' | 'priority';
  status: 'pending' | 'completed' | 'late';
  priority: 'high' | 'medium' | 'low';
  category: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  endDate?: string;
  order?: number;
  weekDays?: string[];
  isRoutine?: boolean;
  notes?: string;
  tags?: string[];
  estimatedDuration?: number;
  actualDuration?: number;
  completedAt?: string;
}

interface ActivitiesContextType {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  addActivity: (activity: Omit<Activity, 'id' | 'status'>) => Promise<void>;
  toggleActivityStatus: (id: string) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>;
  getDailyActivities: () => Activity[];
  getGoals: () => Activity[];
  getPriorityActivities: () => Activity[];
  getActivitiesByDate: (date: string) => Activity[];
  getCompletionRate: () => { completed: number; total: number };
  getProductivityData: () => any[];
  exportData: () => string;
  importData: (data: string) => Promise<void>;
  clearAllData: () => Promise<void>;
}

const ActivitiesContext = createContext<ActivitiesContextType | undefined>(undefined);

export const ActivitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedActivities = localStorage.getItem('activities_data');
        if (savedActivities) {
          setActivities(JSON.parse(savedActivities));
        }
      } catch (err) {
        console.error('Error loading activities data:', err);
        setError('Erro ao carregar atividades');
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever activities change
  useEffect(() => {
    localStorage.setItem('activities_data', JSON.stringify(activities));
  }, [activities]);

  const addActivity = useCallback(async (activityData: Omit<Activity, 'id' | 'status'>) => {
    try {
      setLoading(true);
      const newActivity: Activity = {
        ...activityData,
        id: uuidv4(),
        status: 'pending',
        order: activities.length
      };

      // Check if activity is late
      if (activityData.type !== 'goal' && activityData.type !== 'priority') {
        const activityDate = new Date(`${activityData.date}T${activityData.time || '23:59'}`);
        if (activityDate < new Date()) {
          newActivity.status = 'late';
        }
      }

      // If it's a routine, create multiple instances
      if (activityData.isRoutine && activityData.weekDays) {
        const startDate = new Date(activityData.date);
        const endDate = activityData.endDate ? new Date(activityData.endDate) : new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const routineActivities: Activity[] = [];
        
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
          const dayOfWeek = date.getDay();
          const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          
          if (activityData.weekDays.includes(dayNames[dayOfWeek])) {
            routineActivities.push({
              ...newActivity,
              id: uuidv4(),
              date: date.toISOString().split('T')[0],
            });
          }
        }

        setActivities(prev => [...prev, ...routineActivities]);
      } else {
        setActivities(prev => [...prev, newActivity]);
      }

      setError(null);
    } catch (err) {
      setError('Erro ao adicionar atividade');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [activities]);

  const deleteActivity = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const activityToDelete = activities.find(a => a.id === id);
      if (!activityToDelete) return;

      // If it's a routine, remove all future instances
      if (activityToDelete.isRoutine) {
        const today = new Date().toISOString().split('T')[0];
        setActivities(prev => prev.filter(a => 
          a.id !== id && 
          !(a.isRoutine && 
            a.title === activityToDelete.title && 
            a.date >= today)
        ));
      } else {
        setActivities(prev => prev.filter(a => a.id !== id));
      }

      setError(null);
    } catch (err) {
      setError('Erro ao excluir atividade');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [activities]);

  const toggleActivityStatus = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setActivities(prev => prev.map(activity => {
        if (activity.id === id) {
          const newStatus = activity.status === 'completed' ? 'pending' : 'completed';
          return { 
            ...activity, 
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
          };
        }
        return activity;
      }));
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateActivity = useCallback(async (id: string, updates: Partial<Activity>) => {
    try {
      setLoading(true);
      setActivities(prev => prev.map(activity => {
        if (activity.id === id) {
          return { ...activity, ...updates };
        }
        return activity;
      }));
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar atividade');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDailyActivities = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return activities
      .filter(activity => 
        (activity.type === 'daily' || activity.type === 'routine') && 
        activity.date === today
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [activities]);

  const getGoals = useCallback(() => {
    return activities
      .filter(activity => activity.type === 'goal')
      .sort((a, b) => {
        if (a.priority === 'high') return -1;
        if (b.priority === 'high') return 1;
        if (a.priority === 'medium' && b.priority === 'low') return -1;
        if (a.priority === 'low' && b.priority === 'medium') return 1;
        return 0;
      });
  }, [activities]);

  const getPriorityActivities = useCallback(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return activities
      .filter(activity => 
        activity.type === 'priority' &&
        new Date(activity.date) >= startOfWeek &&
        new Date(activity.date) <= endOfWeek
      )
      .sort((a, b) => {
        if (a.priority === 'high') return -1;
        if (b.priority === 'high') return 1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }, [activities]);

  const getActivitiesByDate = useCallback((date: string) => {
    return activities.filter(activity => activity.date === date);
  }, [activities]);

  const getCompletionRate = useCallback(() => {
    const dailyActivities = getDailyActivities();
    const completed = dailyActivities.filter(activity => activity.status === 'completed').length;
    return {
      completed,
      total: dailyActivities.length
    };
  }, [getDailyActivities]);

  const getProductivityData = useCallback(() => {
    const today = new Date();
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayActivities = activities.filter(a => a.date === dateStr);
      const completed = dayActivities.filter(a => a.status === 'completed').length;
      const pending = dayActivities.filter(a => a.status === 'pending').length;
      const late = dayActivities.filter(a => a.status === 'late').length;

      data.push({
        day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][date.getDay()],
        concluídas: completed,
        pendentes: pending,
        atrasadas: late
      });
    }

    return data;
  }, [activities]);

  const exportData = useCallback(() => {
    const data = {
      activities,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }, [activities]);

  const importData = useCallback(async (data: string) => {
    try {
      setLoading(true);
      const parsed = JSON.parse(data);
      
      if (parsed.activities) {
        setActivities(parsed.activities);
      }
      
      setError(null);
    } catch (err) {
      setError('Erro ao importar dados');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAllData = useCallback(async () => {
    try {
      setLoading(true);
      setActivities([]);
      setError(null);
    } catch (err) {
      setError('Erro ao limpar dados');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ActivitiesContext.Provider value={{
      activities,
      loading,
      error,
      addActivity,
      toggleActivityStatus,
      deleteActivity,
      updateActivity,
      getDailyActivities,
      getGoals,
      getPriorityActivities,
      getActivitiesByDate,
      getCompletionRate,
      getProductivityData,
      exportData,
      importData,
      clearAllData
    }}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  if (!context) {
    throw new Error('useActivities must be used within an ActivitiesProvider');
  }
  return context;
};
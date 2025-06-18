import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface HealthMetric {
  id: string;
  type: 'water' | 'sleep' | 'exercise' | 'nutrition' | 'weight' | 'mood';
  value: number;
  unit: string;
  date: string;
  time: string;
  notes?: string;
}

export interface HealthGoal {
  id: string;
  type: HealthMetric['type'];
  target: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
}

export interface HealthInsight {
  id: string;
  type: 'recommendation' | 'achievement' | 'warning';
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

interface HealthContextType {
  metrics: HealthMetric[];
  goals: HealthGoal[];
  insights: HealthInsight[];
  loading: boolean;
  error: string | null;
  addMetric: (metric: Omit<HealthMetric, 'id'>) => Promise<void>;
  updateMetric: (id: string, updates: Partial<HealthMetric>) => Promise<void>;
  deleteMetric: (id: string) => Promise<void>;
  addGoal: (goal: Omit<HealthGoal, 'id'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<HealthGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  getMetricsByType: (type: HealthMetric['type']) => HealthMetric[];
  getMetricsByDate: (date: string) => HealthMetric[];
  getTodaysMetrics: () => HealthMetric[];
  getHealthScore: () => number;
  getGoalProgress: (goalId: string) => number;
  generateInsights: () => Promise<void>;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedMetrics = localStorage.getItem('health_metrics');
        const savedGoals = localStorage.getItem('health_goals');
        const savedInsights = localStorage.getItem('health_insights');

        if (savedMetrics) {
          setMetrics(JSON.parse(savedMetrics));
        } else {
          // Initialize with sample data
          const sampleMetrics: HealthMetric[] = [
            {
              id: uuidv4(),
              type: 'water',
              value: 1800,
              unit: 'ml',
              date: new Date().toISOString().split('T')[0],
              time: '10:30'
            },
            {
              id: uuidv4(),
              type: 'sleep',
              value: 7.5,
              unit: 'horas',
              date: new Date().toISOString().split('T')[0],
              time: '08:00'
            },
            {
              id: uuidv4(),
              type: 'exercise',
              value: 45,
              unit: 'min',
              date: new Date().toISOString().split('T')[0],
              time: '18:00'
            }
          ];
          setMetrics(sampleMetrics);
        }

        if (savedGoals) {
          setGoals(JSON.parse(savedGoals));
        } else {
          // Initialize with default goals
          const defaultGoals: HealthGoal[] = [
            {
              id: uuidv4(),
              type: 'water',
              target: 2500,
              unit: 'ml',
              frequency: 'daily',
              isActive: true
            },
            {
              id: uuidv4(),
              type: 'sleep',
              target: 8,
              unit: 'horas',
              frequency: 'daily',
              isActive: true
            },
            {
              id: uuidv4(),
              type: 'exercise',
              target: 60,
              unit: 'min',
              frequency: 'daily',
              isActive: true
            },
            {
              id: uuidv4(),
              type: 'nutrition',
              target: 10,
              unit: 'pontos',
              frequency: 'daily',
              isActive: true
            }
          ];
          setGoals(defaultGoals);
        }

        if (savedInsights) {
          setInsights(JSON.parse(savedInsights));
        }
      } catch (err) {
        console.error('Error loading health data:', err);
        setError('Erro ao carregar dados de saúde');
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('health_metrics', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem('health_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('health_insights', JSON.stringify(insights));
  }, [insights]);

  const addMetric = async (metricData: Omit<HealthMetric, 'id'>) => {
    try {
      setLoading(true);
      const newMetric: HealthMetric = {
        ...metricData,
        id: uuidv4()
      };

      setMetrics(prev => [newMetric, ...prev]);
      await generateInsights();
      setError(null);
    } catch (err) {
      setError('Erro ao adicionar métrica');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMetric = async (id: string, updates: Partial<HealthMetric>) => {
    try {
      setLoading(true);
      setMetrics(prev => prev.map(metric => 
        metric.id === id ? { ...metric, ...updates } : metric
      ));
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar métrica');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMetric = async (id: string) => {
    try {
      setLoading(true);
      setMetrics(prev => prev.filter(metric => metric.id !== id));
      setError(null);
    } catch (err) {
      setError('Erro ao excluir métrica');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goalData: Omit<HealthGoal, 'id'>) => {
    try {
      setLoading(true);
      const newGoal: HealthGoal = {
        ...goalData,
        id: uuidv4()
      };

      setGoals(prev => [...prev, newGoal]);
      setError(null);
    } catch (err) {
      setError('Erro ao adicionar meta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (id: string, updates: Partial<HealthGoal>) => {
    try {
      setLoading(true);
      setGoals(prev => prev.map(goal => 
        goal.id === id ? { ...goal, ...updates } : goal
      ));
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar meta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      setLoading(true);
      setGoals(prev => prev.filter(goal => goal.id !== id));
      setError(null);
    } catch (err) {
      setError('Erro ao excluir meta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMetricsByType = (type: HealthMetric['type']) => {
    return metrics.filter(metric => metric.type === type);
  };

  const getMetricsByDate = (date: string) => {
    return metrics.filter(metric => metric.date === date);
  };

  const getTodaysMetrics = () => {
    const today = new Date().toISOString().split('T')[0];
    return getMetricsByDate(today);
  };

  const getHealthScore = () => {
    const todaysMetrics = getTodaysMetrics();
    const activeGoals = goals.filter(goal => goal.isActive);
    
    if (activeGoals.length === 0) return 0;

    let totalScore = 0;
    let goalCount = 0;

    activeGoals.forEach(goal => {
      const relevantMetrics = todaysMetrics.filter(metric => metric.type === goal.type);
      const totalValue = relevantMetrics.reduce((sum, metric) => sum + metric.value, 0);
      const progress = Math.min((totalValue / goal.target) * 100, 100);
      
      totalScore += progress;
      goalCount++;
    });

    return goalCount > 0 ? Math.round(totalScore / goalCount) : 0;
  };

  const getGoalProgress = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return 0;

    const today = new Date().toISOString().split('T')[0];
    const todaysMetrics = getMetricsByDate(today).filter(metric => metric.type === goal.type);
    const totalValue = todaysMetrics.reduce((sum, metric) => sum + metric.value, 0);
    
    return Math.min((totalValue / goal.target) * 100, 100);
  };

  const generateInsights = async () => {
    try {
      const newInsights: HealthInsight[] = [];
      const todaysMetrics = getTodaysMetrics();
      const healthScore = getHealthScore();

      // Generate insights based on health score
      if (healthScore < 50) {
        newInsights.push({
          id: uuidv4(),
          type: 'warning',
          title: 'Score de Saúde Baixo',
          description: 'Seu score de saúde está abaixo do ideal. Considere focar em suas metas diárias.',
          category: 'geral',
          priority: 'high',
          createdAt: new Date().toISOString()
        });
      } else if (healthScore > 80) {
        newInsights.push({
          id: uuidv4(),
          type: 'achievement',
          title: 'Excelente Progresso!',
          description: 'Parabéns! Você está mantendo um ótimo score de saúde.',
          category: 'geral',
          priority: 'medium',
          createdAt: new Date().toISOString()
        });
      }

      // Water intake insights
      const waterGoal = goals.find(g => g.type === 'water' && g.isActive);
      if (waterGoal) {
        const waterProgress = getGoalProgress(waterGoal.id);
        if (waterProgress < 50) {
          newInsights.push({
            id: uuidv4(),
            type: 'recommendation',
            title: 'Hidratação Insuficiente',
            description: 'Você está bebendo menos água que o recomendado. Tente beber um copo a cada hora.',
            category: 'hidratação',
            priority: 'medium',
            createdAt: new Date().toISOString()
          });
        }
      }

      setInsights(prev => [...newInsights, ...prev.slice(0, 10)]); // Keep only last 10 insights
    } catch (err) {
      console.error('Error generating insights:', err);
    }
  };

  return (
    <HealthContext.Provider value={{
      metrics,
      goals,
      insights,
      loading,
      error,
      addMetric,
      updateMetric,
      deleteMetric,
      addGoal,
      updateGoal,
      deleteGoal,
      getMetricsByType,
      getMetricsByDate,
      getTodaysMetrics,
      getHealthScore,
      getGoalProgress,
      generateInsights
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
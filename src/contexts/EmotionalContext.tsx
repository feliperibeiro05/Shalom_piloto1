import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Emotion = 'happy' | 'sad' | 'anxious' | 'calm' | 'energetic' | 'tired' | 'neutral' | 'angry' | 'excited' | 'stressed';

export interface EmotionEntry {
  id: string;
  emotion: Emotion;
  intensity: number; // 1-10 scale
  timestamp: string;
  note?: string;
  triggers?: string[];
  activities?: string[];
}

export interface MoodPattern {
  emotion: Emotion;
  averageIntensity: number;
  frequency: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  commonTriggers: string[];
}

export interface EmotionalInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

interface EmotionalContextType {
  emotions: EmotionEntry[];
  patterns: MoodPattern[];
  insights: EmotionalInsight[];
  loading: boolean;
  error: string | null;
  addEmotion: (emotion: Omit<EmotionEntry, 'id' | 'timestamp'>) => Promise<void>;
  updateEmotion: (id: string, updates: Partial<EmotionEntry>) => Promise<void>;
  deleteEmotion: (id: string) => Promise<void>;
  getEmotionsByDate: (date: string) => EmotionEntry[];
  getTodaysEmotions: () => EmotionEntry[];
  getWellbeingScore: () => number;
  getMoodTrend: (days: number) => { date: string; averageMood: number }[];
  generatePatterns: () => Promise<void>;
  generateInsights: () => Promise<void>;
  getEmotionStats: () => { [key in Emotion]?: number };
  getWeeklySummary: () => {
    mostFrequentEmotion: Emotion | null;
    bestDay: { day: string; score: number } | null;
    worstDay: { day: string; score: number } | null;
    overallScore: number;
    suggestions: string[];
  };
}

const EmotionalContext = createContext<EmotionalContextType | undefined>(undefined);

export const EmotionalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emotions, setEmotions] = useState<EmotionEntry[]>([]);
  const [patterns, setPatterns] = useState<MoodPattern[]>([]);
  const [insights, setInsights] = useState<EmotionalInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedEmotions = localStorage.getItem('emotional_data');
        const savedPatterns = localStorage.getItem('emotional_patterns');
        const savedInsights = localStorage.getItem('emotional_insights');

        if (savedEmotions) {
          setEmotions(JSON.parse(savedEmotions));
        }

        if (savedPatterns) {
          setPatterns(JSON.parse(savedPatterns));
        }

        if (savedInsights) {
          setInsights(JSON.parse(savedInsights));
        }
      } catch (err) {
        console.error('Error loading emotional data:', err);
        setError('Erro ao carregar dados emocionais');
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('emotional_data', JSON.stringify(emotions));
  }, [emotions]);

  useEffect(() => {
    localStorage.setItem('emotional_patterns', JSON.stringify(patterns));
  }, [patterns]);

  useEffect(() => {
    localStorage.setItem('emotional_insights', JSON.stringify(insights));
  }, [insights]);

  const addEmotion = async (emotionData: Omit<EmotionEntry, 'id' | 'timestamp'>) => {
    try {
      setLoading(true);
      const newEmotion: EmotionEntry = {
        ...emotionData,
        id: uuidv4(),
        timestamp: new Date().toISOString()
      };

      setEmotions(prev => [newEmotion, ...prev]);
      
      // Generate patterns and insights after adding emotion
      await generatePatterns();
      await generateInsights();
      
      setError(null);
    } catch (err) {
      setError('Erro ao registrar emoção');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmotion = async (id: string, updates: Partial<EmotionEntry>) => {
    try {
      setLoading(true);
      setEmotions(prev => prev.map(emotion => 
        emotion.id === id ? { ...emotion, ...updates } : emotion
      ));
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar emoção');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmotion = async (id: string) => {
    try {
      setLoading(true);
      setEmotions(prev => prev.filter(emotion => emotion.id !== id));
      setError(null);
    } catch (err) {
      setError('Erro ao excluir emoção');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEmotionsByDate = (date: string) => {
    return emotions.filter(emotion => 
      emotion.timestamp.split('T')[0] === date
    );
  };

  const getTodaysEmotions = () => {
    const today = new Date().toISOString().split('T')[0];
    return getEmotionsByDate(today);
  };

  const getWellbeingScore = () => {
    const recentEmotions = emotions.slice(0, 7); // Last 7 emotions
    if (recentEmotions.length === 0) return 50;

    const emotionWeights: { [key in Emotion]: number } = {
      happy: 1,
      excited: 0.9,
      calm: 0.8,
      energetic: 0.7,
      neutral: 0,
      tired: -0.3,
      stressed: -0.5,
      anxious: -0.6,
      angry: -0.7,
      sad: -0.8
    };

    const totalScore = recentEmotions.reduce((acc, emotion) => {
      const baseScore = emotionWeights[emotion.emotion] || 0;
      const intensityFactor = emotion.intensity / 10;
      return acc + (baseScore * intensityFactor);
    }, 0);

    const averageScore = (totalScore / recentEmotions.length + 1) * 50;
    return Math.round(Math.max(0, Math.min(100, averageScore)));
  };

  const getMoodTrend = (days: number) => {
    const trend: { date: string; averageMood: number }[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayEmotions = getEmotionsByDate(dateString);
      const averageMood = dayEmotions.length > 0
        ? dayEmotions.reduce((sum, emotion) => sum + emotion.intensity, 0) / dayEmotions.length
        : 5;

      trend.push({
        date: dateString,
        averageMood
      });
    }

    return trend;
  };

  const generatePatterns = async () => {
    try {
      const emotionGroups: { [key in Emotion]?: EmotionEntry[] } = {};
      
      emotions.forEach(emotion => {
        if (!emotionGroups[emotion.emotion]) {
          emotionGroups[emotion.emotion] = [];
        }
        emotionGroups[emotion.emotion]!.push(emotion);
      });

      const newPatterns: MoodPattern[] = [];

      Object.entries(emotionGroups).forEach(([emotion, entries]) => {
        if (entries && entries.length > 0) {
          const averageIntensity = entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length;
          const frequency = entries.length;
          
          // Determine most common time of day
          const timeGroups = { morning: 0, afternoon: 0, evening: 0, night: 0 };
          entries.forEach(entry => {
            const hour = new Date(entry.timestamp).getHours();
            if (hour >= 6 && hour < 12) timeGroups.morning++;
            else if (hour >= 12 && hour < 18) timeGroups.afternoon++;
            else if (hour >= 18 && hour < 22) timeGroups.evening++;
            else timeGroups.night++;
          });
          
          const timeOfDay = Object.entries(timeGroups).reduce((a, b) => 
            timeGroups[a[0] as keyof typeof timeGroups] > timeGroups[b[0] as keyof typeof timeGroups] ? a : b
          )[0] as 'morning' | 'afternoon' | 'evening' | 'night';

          // Get common triggers
          const allTriggers = entries.flatMap(entry => entry.triggers || []);
          const triggerCounts: { [key: string]: number } = {};
          allTriggers.forEach(trigger => {
            triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
          });
          
          const commonTriggers = Object.entries(triggerCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([trigger]) => trigger);

          newPatterns.push({
            emotion: emotion as Emotion,
            averageIntensity,
            frequency,
            timeOfDay,
            commonTriggers
          });
        }
      });

      setPatterns(newPatterns);
    } catch (err) {
      console.error('Error generating patterns:', err);
    }
  };

  const generateInsights = async () => {
    try {
      const newInsights: EmotionalInsight[] = [];
      const wellbeingScore = getWellbeingScore();
      const todaysEmotions = getTodaysEmotions();

      // Wellbeing score insights
      if (wellbeingScore < 30) {
        newInsights.push({
          id: uuidv4(),
          type: 'recommendation',
          title: 'Bem-estar Baixo Detectado',
          description: 'Seu bem-estar emocional está baixo. Considere praticar técnicas de relaxamento ou conversar com alguém.',
          priority: 'high',
          createdAt: new Date().toISOString()
        });
      } else if (wellbeingScore > 80) {
        newInsights.push({
          id: uuidv4(),
          type: 'achievement',
          title: 'Excelente Estado Emocional!',
          description: 'Você está mantendo um ótimo bem-estar emocional. Continue assim!',
          priority: 'medium',
          createdAt: new Date().toISOString()
        });
      }

      // Pattern-based insights
      const anxiousPattern = patterns.find(p => p.emotion === 'anxious');
      if (anxiousPattern && anxiousPattern.frequency > 5) {
        newInsights.push({
          id: uuidv4(),
          type: 'pattern',
          title: 'Padrão de Ansiedade Identificado',
          description: `Você tem registrado ansiedade frequentemente durante a ${anxiousPattern.timeOfDay}. Considere técnicas de respiração nesse período.`,
          priority: 'medium',
          createdAt: new Date().toISOString()
        });
      }

      // Time-based insights
      const morningEmotions = emotions.filter(e => {
        const hour = new Date(e.timestamp).getHours();
        return hour >= 6 && hour < 12;
      });
      
      const eveningEmotions = emotions.filter(e => {
        const hour = new Date(e.timestamp).getHours();
        return hour >= 18 && hour < 22;
      });
      
      if (morningEmotions.length > 5 && eveningEmotions.length > 5) {
        const morningPositive = morningEmotions.filter(e => 
          ['happy', 'calm', 'energetic', 'excited'].includes(e.emotion)
        ).length;
        
        const eveningPositive = eveningEmotions.filter(e => 
          ['happy', 'calm', 'energetic', 'excited'].includes(e.emotion)
        ).length;
        
        if (morningPositive / morningEmotions.length > eveningPositive / eveningEmotions.length) {
          newInsights.push({
            id: uuidv4(),
            type: 'pattern',
            title: 'Manhãs Mais Positivas',
            description: 'Você tende a se sentir melhor pela manhã. Considere programar atividades importantes para este período.',
            priority: 'medium',
            createdAt: new Date().toISOString()
          });
        } else {
          newInsights.push({
            id: uuidv4(),
            type: 'pattern',
            title: 'Noites Mais Positivas',
            description: 'Você tende a se sentir melhor à noite. Considere programar atividades importantes para este período.',
            priority: 'medium',
            createdAt: new Date().toISOString()
          });
        }
      }

      setInsights(prev => [...newInsights, ...prev.slice(0, 10)]);
    } catch (err) {
      console.error('Error generating insights:', err);
    }
  };

  const getEmotionStats = () => {
    const stats: { [key in Emotion]?: number } = {};
    
    emotions.forEach(emotion => {
      stats[emotion.emotion] = (stats[emotion.emotion] || 0) + 1;
    });

    return stats;
  };

  const getWeeklySummary = () => {
    const lastWeekEmotions = emotions.filter(e => {
      const date = new Date(e.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    });

    if (lastWeekEmotions.length === 0) {
      return {
        mostFrequentEmotion: null,
        bestDay: null,
        worstDay: null,
        overallScore: 50,
        suggestions: ['Comece a registrar suas emoções diariamente para obter insights personalizados.']
      };
    }

    // Most frequent emotion
    const emotionCounts: { [key in Emotion]?: number } = {};
    lastWeekEmotions.forEach(e => {
      emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
    });
    
    const mostFrequentEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0][0] as Emotion;

    // Best and worst days
    const dayScores: { [date: string]: { total: number; count: number } } = {};
    lastWeekEmotions.forEach(e => {
      const date = e.timestamp.split('T')[0];
      if (!dayScores[date]) {
        dayScores[date] = { total: 0, count: 0 };
      }
      dayScores[date].total += e.intensity;
      dayScores[date].count += 1;
    });

    const dayAverages = Object.entries(dayScores).map(([date, { total, count }]) => ({
      day: date,
      score: total / count
    }));

    const bestDay = dayAverages.length > 0 
      ? dayAverages.reduce((best, current) => current.score > best.score ? current : best, dayAverages[0])
      : null;
      
    const worstDay = dayAverages.length > 0
      ? dayAverages.reduce((worst, current) => current.score < worst.score ? current : worst, dayAverages[0])
      : null;

    // Overall score
    const overallScore = getWellbeingScore();

    // Generate suggestions
    const suggestions: string[] = [];
    
    if (mostFrequentEmotion === 'anxious' || mostFrequentEmotion === 'stressed') {
      suggestions.push('Considere praticar técnicas de respiração ou meditação para reduzir a ansiedade.');
    }
    
    if (mostFrequentEmotion === 'sad') {
      suggestions.push('Tente incluir atividades que você gosta em sua rotina diária.');
    }
    
    if (mostFrequentEmotion === 'tired') {
      suggestions.push('Revise seus hábitos de sono e considere ajustar sua rotina para incluir mais descanso.');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('Continue monitorando suas emoções para obter insights mais personalizados.');
    }

    return {
      mostFrequentEmotion,
      bestDay,
      worstDay,
      overallScore,
      suggestions
    };
  };

  return (
    <EmotionalContext.Provider value={{
      emotions,
      patterns,
      insights,
      loading,
      error,
      addEmotion,
      updateEmotion,
      deleteEmotion,
      getEmotionsByDate,
      getTodaysEmotions,
      getWellbeingScore,
      getMoodTrend,
      generatePatterns,
      generateInsights,
      getEmotionStats,
      getWeeklySummary
    }}>
      {children}
    </EmotionalContext.Provider>
  );
};

export const useEmotional = () => {
  const context = useContext(EmotionalContext);
  if (!context) {
    throw new Error('useEmotional must be used within an EmotionalProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface DiaryEntry {
  id: string;
  content: string;
  date: string;
  mood?: string;
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  analysis?: {
    sentiment: number;
    emotions: string[];
    topics: string[];
    readingTime: number;
  };
}

export interface DiaryTemplate {
  id: string;
  name: string;
  prompts: string[];
  category: 'gratitude' | 'reflection' | 'goals' | 'custom';
}

export interface DiaryStats {
  totalEntries: number;
  totalWords: number;
  averageWordsPerEntry: number;
  longestStreak: number;
  currentStreak: number;
  mostUsedTags: { tag: string; count: number }[];
  moodDistribution: { mood: string; count: number }[];
}

interface DiaryContextType {
  entries: DiaryEntry[];
  templates: DiaryTemplate[];
  stats: DiaryStats;
  loading: boolean;
  error: string | null;
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'wordCount' | 'analysis'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<DiaryEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntriesByDate: (date: string) => DiaryEntry[];
  getEntriesByTag: (tag: string) => DiaryEntry[];
  getEntriesByMood: (mood: string) => DiaryEntry[];
  searchEntries: (query: string) => DiaryEntry[];
  addTemplate: (template: Omit<DiaryTemplate, 'id'>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  exportEntries: () => string;
  importEntries: (data: string) => Promise<void>;
  calculateStats: () => void;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [templates, setTemplates] = useState<DiaryTemplate[]>([]);
  const [stats, setStats] = useState<DiaryStats>({
    totalEntries: 0,
    totalWords: 0,
    averageWordsPerEntry: 0,
    longestStreak: 0,
    currentStreak: 0,
    mostUsedTags: [],
    moodDistribution: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedEntries = localStorage.getItem('diary_entries');
        const savedTemplates = localStorage.getItem('diary_templates');

        if (savedEntries) {
          setEntries(JSON.parse(savedEntries));
        }

        if (savedTemplates) {
          setTemplates(JSON.parse(savedTemplates));
        } else {
          // Initialize with default templates
          const defaultTemplates: DiaryTemplate[] = [
            {
              id: uuidv4(),
              name: 'Gratidão Diária',
              prompts: [
                'Pelo que você é grato hoje?',
                'Qual foi o melhor momento do seu dia?',
                'Que pessoa fez diferença na sua vida hoje?'
              ],
              category: 'gratitude'
            },
            {
              id: uuidv4(),
              name: 'Reflexão Noturna',
              prompts: [
                'Como foi seu dia?',
                'O que você aprendeu hoje?',
                'O que você faria diferente?',
                'Como você se sente agora?'
              ],
              category: 'reflection'
            },
            {
              id: uuidv4(),
              name: 'Planejamento de Metas',
              prompts: [
                'Quais são seus objetivos para amanhã?',
                'Que progresso você fez em suas metas?',
                'Que obstáculos você enfrentou?',
                'Como você pode melhorar?'
              ],
              category: 'goals'
            }
          ];
          setTemplates(defaultTemplates);
        }
      } catch (err) {
        console.error('Error loading diary data:', err);
        setError('Erro ao carregar dados do diário');
      }
    };

    loadData();
  }, []);

  // Save data to localStorage and recalculate stats
  useEffect(() => {
    localStorage.setItem('diary_entries', JSON.stringify(entries));
    calculateStats();
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('diary_templates', JSON.stringify(templates));
  }, [templates]);

  const analyzeEntry = (content: string): DiaryEntry['analysis'] => {
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200); // Average reading speed

    // Simple sentiment analysis (placeholder)
    const positiveWords = ['feliz', 'alegre', 'grato', 'ótimo', 'excelente', 'maravilhoso'];
    const negativeWords = ['triste', 'ruim', 'difícil', 'problema', 'preocupado', 'ansioso'];
    
    const lowerContent = content.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;
    
    const sentiment = positiveCount > negativeCount ? 0.7 : 
                     negativeCount > positiveCount ? 0.3 : 0.5;

    return {
      sentiment,
      emotions: sentiment > 0.6 ? ['positivo'] : sentiment < 0.4 ? ['negativo'] : ['neutro'],
      topics: ['reflexão', 'pessoal'],
      readingTime
    };
  };

  const addEntry = async (entryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'wordCount' | 'analysis'>) => {
    try {
      setLoading(true);
      const wordCount = entryData.content.trim().split(/\s+/).length;
      const analysis = analyzeEntry(entryData.content);
      
      const newEntry: DiaryEntry = {
        ...entryData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wordCount,
        analysis
      };

      setEntries(prev => [newEntry, ...prev]);
      setError(null);
    } catch (err) {
      setError('Erro ao adicionar entrada');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (id: string, updates: Partial<DiaryEntry>) => {
    try {
      setLoading(true);
      setEntries(prev => prev.map(entry => {
        if (entry.id === id) {
          const updatedEntry = { ...entry, ...updates, updatedAt: new Date().toISOString() };
          
          if (updates.content) {
            updatedEntry.wordCount = updates.content.trim().split(/\s+/).length;
            updatedEntry.analysis = analyzeEntry(updates.content);
          }
          
          return updatedEntry;
        }
        return entry;
      }));
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar entrada');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      setLoading(true);
      setEntries(prev => prev.filter(entry => entry.id !== id));
      setError(null);
    } catch (err) {
      setError('Erro ao excluir entrada');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEntriesByDate = (date: string) => {
    return entries.filter(entry => entry.date === date);
  };

  const getEntriesByTag = (tag: string) => {
    return entries.filter(entry => entry.tags.includes(tag));
  };

  const getEntriesByMood = (mood: string) => {
    return entries.filter(entry => entry.mood === mood);
  };

  const searchEntries = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return entries.filter(entry => 
      entry.content.toLowerCase().includes(lowerQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      (entry.mood && entry.mood.toLowerCase().includes(lowerQuery))
    );
  };

  const addTemplate = async (templateData: Omit<DiaryTemplate, 'id'>) => {
    try {
      setLoading(true);
      const newTemplate: DiaryTemplate = {
        ...templateData,
        id: uuidv4()
      };

      setTemplates(prev => [...prev, newTemplate]);
      setError(null);
    } catch (err) {
      setError('Erro ao adicionar template');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      setLoading(true);
      setTemplates(prev => prev.filter(template => template.id !== id));
      setError(null);
    } catch (err) {
      setError('Erro ao excluir template');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportEntries = () => {
    const data = {
      entries,
      templates,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importEntries = async (data: string) => {
    try {
      setLoading(true);
      const parsed = JSON.parse(data);
      
      if (parsed.entries) {
        setEntries(parsed.entries);
      }
      
      if (parsed.templates) {
        setTemplates(parsed.templates);
      }
      
      setError(null);
    } catch (err) {
      setError('Erro ao importar dados');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
    const averageWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

    // Calculate streaks
    const sortedDates = [...new Set(entries.map(entry => entry.date))].sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if there's an entry today or yesterday to start counting current streak
    const hasRecentEntry = sortedDates.includes(today.toISOString().split('T')[0]) ||
                          sortedDates.includes(yesterday.toISOString().split('T')[0]);

    if (hasRecentEntry) {
      for (let i = sortedDates.length - 1; i >= 0; i--) {
        const currentDate = new Date(sortedDates[i]);
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - (sortedDates.length - 1 - i));

        if (currentDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(sortedDates[i - 1]);
        const currentDate = new Date(sortedDates[i]);
        const dayDiff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

        if (dayDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Most used tags
    const tagCounts: { [key: string]: number } = {};
    entries.forEach(entry => {
      entry.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const mostUsedTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Mood distribution
    const moodCounts: { [key: string]: number } = {};
    entries.forEach(entry => {
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      }
    });

    const moodDistribution = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([mood, count]) => ({ mood, count }));

    setStats({
      totalEntries,
      totalWords,
      averageWordsPerEntry,
      longestStreak,
      currentStreak,
      mostUsedTags,
      moodDistribution
    });
  };

  return (
    <DiaryContext.Provider value={{
      entries,
      templates,
      stats,
      loading,
      error,
      addEntry,
      updateEntry,
      deleteEntry,
      getEntriesByDate,
      getEntriesByTag,
      getEntriesByMood,
      searchEntries,
      addTemplate,
      deleteTemplate,
      exportEntries,
      importEntries,
      calculateStats
    }}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};
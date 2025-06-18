import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  completed: boolean;
  points: number;
  category: 'daily' | 'weekly' | 'monthly' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'backgrounds' | 'badges' | 'themes' | 'effects';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owned?: boolean;
  equipped?: boolean;
}

export interface UserProfile {
  level: number;
  experience: number;
  points: number;
  title: string;
  badges: string[];
  equippedItems: { [category: string]: string };
}

interface RewardsContextType {
  achievements: Achievement[];
  storeItems: StoreItem[];
  userProfile: UserProfile;
  loading: boolean;
  error: string | null;
  updateAchievementProgress: (id: string, progress: number) => Promise<void>;
  purchaseItem: (id: string) => Promise<void>;
  equipItem: (id: string) => Promise<void>;
  addExperience: (amount: number) => Promise<void>;
  addPoints: (amount: number) => Promise<void>;
  checkAchievements: () => Promise<void>;
  getAvailableItems: () => StoreItem[];
  getOwnedItems: () => StoreItem[];
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const RewardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    level: 1,
    experience: 0,
    points: 1500,
    title: 'Iniciante',
    badges: [],
    equippedItems: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    const loadData = () => {
      try {
        const savedAchievements = localStorage.getItem('rewards_achievements');
        const savedStoreItems = localStorage.getItem('rewards_store_items');
        const savedUserProfile = localStorage.getItem('rewards_user_profile');
        
        if (savedAchievements) {
          setAchievements(JSON.parse(savedAchievements));
        } else {
          // Initialize with sample achievements
          const sampleAchievements: Achievement[] = [
            {
              id: '1',
              title: 'Primeiro Passo',
              description: 'Complete sua primeira atividade',
              icon: '🎯',
              progress: 1,
              total: 1,
              completed: true,
              points: 50,
              category: 'daily',
              rarity: 'common',
              unlockedAt: new Date().toISOString()
            },
            {
              id: '2',
              title: 'Mestre da Consistência',
              description: 'Complete todas as tarefas diárias por 7 dias seguidos',
              icon: '🏆',
              progress: 3,
              total: 7,
              completed: false,
              points: 200,
              category: 'weekly',
              rarity: 'rare'
            },
            {
              id: '3',
              title: 'Guru da Meditação',
              description: 'Complete 30 dias de meditação',
              icon: '🧘',
              progress: 15,
              total: 30,
              completed: false,
              points: 500,
              category: 'monthly',
              rarity: 'epic'
            }
          ];
          setAchievements(sampleAchievements);
        }

        if (savedStoreItems) {
          setStoreItems(JSON.parse(savedStoreItems));
        } else {
          // Initialize with sample store items
          const sampleItems: StoreItem[] = [
            {
              id: '1',
              name: 'Tema Galáctico',
              description: 'Um tema espacial exclusivo para seu perfil',
              price: 1000,
              image: 'https://images.unsplash.com/photo-1539721972319-f0e80a00d424',
              category: 'themes',
              rarity: 'epic'
            },
            {
              id: '2',
              name: 'Badge Diamante',
              description: 'Mostre seu status com este badge exclusivo',
              price: 2000,
              image: 'https://images.unsplash.com/photo-1636755889643-5d45c1d87389',
              category: 'badges',
              rarity: 'legendary'
            },
            {
              id: '3',
              name: 'Efeito Aurora',
              description: 'Adicione um brilho especial ao seu nome',
              price: 500,
              image: 'https://images.unsplash.com/photo-1579033385971-c5883d14deef',
              category: 'effects',
              rarity: 'rare'
            }
          ];
          setStoreItems(sampleItems);
        }

        if (savedUserProfile) {
          setUserProfile(JSON.parse(savedUserProfile));
        }
      } catch (err) {
        console.error('Error loading rewards data:', err);
        setError('Erro ao carregar dados de recompensas');
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('rewards_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('rewards_store_items', JSON.stringify(storeItems));
  }, [storeItems]);

  useEffect(() => {
    localStorage.setItem('rewards_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const updateAchievementProgress = async (id: string, progress: number) => {
    try {
      setLoading(true);
      setAchievements(prev => prev.map(achievement => {
        if (achievement.id === id) {
          const newProgress = Math.min(progress, achievement.total);
          const completed = newProgress >= achievement.total;
          
          if (completed && !achievement.completed) {
            // Award points for completing achievement
            setUserProfile(profile => ({
              ...profile,
              points: profile.points + achievement.points
            }));
          }

          return {
            ...achievement,
            progress: newProgress,
            completed,
            unlockedAt: completed && !achievement.completed ? new Date().toISOString() : achievement.unlockedAt
          };
        }
        return achievement;
      }));
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar progresso');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const purchaseItem = async (id: string) => {
    try {
      setLoading(true);
      const item = storeItems.find(i => i.id === id);
      if (!item || item.owned || userProfile.points < item.price) {
        throw new Error('Item não disponível ou pontos insuficientes');
      }

      setUserProfile(prev => ({
        ...prev,
        points: prev.points - item.price
      }));

      setStoreItems(prev => prev.map(i => 
        i.id === id ? { ...i, owned: true } : i
      ));

      setError(null);
    } catch (err) {
      setError('Erro ao comprar item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const equipItem = async (id: string) => {
    try {
      setLoading(true);
      const item = storeItems.find(i => i.id === id);
      if (!item || !item.owned) {
        throw new Error('Item não disponível');
      }

      setUserProfile(prev => ({
        ...prev,
        equippedItems: {
          ...prev.equippedItems,
          [item.category]: id
        }
      }));

      setStoreItems(prev => prev.map(i => ({
        ...i,
        equipped: i.id === id && i.category === item.category
      })));

      setError(null);
    } catch (err) {
      setError('Erro ao equipar item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addExperience = async (amount: number) => {
    try {
      setUserProfile(prev => {
        const newExp = prev.experience + amount;
        const newLevel = Math.floor(newExp / 1000) + 1;
        
        return {
          ...prev,
          experience: newExp,
          level: newLevel,
          title: newLevel > 10 ? 'Especialista' : newLevel > 5 ? 'Intermediário' : 'Iniciante'
        };
      });
    } catch (err) {
      console.error('Error adding experience:', err);
    }
  };

  const addPoints = async (amount: number) => {
    try {
      setUserProfile(prev => ({
        ...prev,
        points: prev.points + amount
      }));
    } catch (err) {
      console.error('Error adding points:', err);
    }
  };

  const checkAchievements = async () => {
    // This would check various conditions and update achievements
    // For now, it's a placeholder
  };

  const getAvailableItems = () => {
    return storeItems.filter(item => !item.owned);
  };

  const getOwnedItems = () => {
    return storeItems.filter(item => item.owned);
  };

  return (
    <RewardsContext.Provider value={{
      achievements,
      storeItems,
      userProfile,
      loading,
      error,
      updateAchievementProgress,
      purchaseItem,
      equipItem,
      addExperience,
      addPoints,
      checkAchievements,
      getAvailableItems,
      getOwnedItems
    }}>
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { useActivities } from './ActivitiesContext';
import { useDevelopment } from './DevelopmentContext';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface UserState {
  mood: 'positive' | 'neutral' | 'negative';
  focusLevel: number;
  productiveHours: number[];
  lastActivity: string;
  completedTasks: number;
  interests: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic';
  energyPattern: 'morning' | 'afternoon' | 'evening';
  stressLevel: number;
  goals: string[];
  currentActivities: {
    total: number;
    completed: number;
    pending: number;
    late: number;
  };
}

interface SophiaContextType {
  messages: Message[];
  isThinking: boolean;
  userState: UserState;
  sendMessage: (message: string) => Promise<void>;
  clearConversation: () => void;
}

// Create the context before using it
const SophiaContext = createContext<SophiaContextType | undefined>(undefined);

const SYSTEM_PROMPT = `Você é Sophia, uma assistente amigável e empática que ajuda as pessoas a se desenvolverem. Algumas diretrizes importantes:

1. Personalidade
- Seja amigável e casual, como uma amiga próxima
- Use linguagem informal e emojis ocasionalmente
- Adapte seu tom ao contexto - mais leve para conversas casuais, mais séria para assuntos importantes
- Demonstre empatia e compreensão

2. Respostas
- Para perguntas simples, seja direta e concisa
- Para assuntos complexos, forneça explicações mais detalhadas
- Evite respostas genéricas ou robóticas
- Personalize baseado no histórico e perfil do usuário

3. Interação
- Faça perguntas de acompanhamento quando relevante
- Celebre conquistas e progressos
- Ofereça suporte emocional quando necessário
- Mantenha um tom encorajador e positivo

4. Conhecimento
- Use dados do usuário para personalizar sugestões
- Aprenda com interações anteriores
- Adapte recomendações ao estilo de aprendizado
- Considere horários produtivos e níveis de energia

5. Acesso aos Dados
- Você tem acesso às atividades do usuário através do userState
- Pode ver o total de atividades, concluídas, pendentes e atrasadas
- Use essas informações para dar sugestões relevantes

Exemplos:
✅ "Oi! Vi que você tem 3 atividades pendentes hoje. Quer ajuda pra organizar? 😊"
✅ "Legal! Das 5 atividades de hoje, você já completou 3! 🎉 Vamos ver as outras?"
✅ "Notei que você costuma ser mais produtivo pela manhã. Que tal priorizarmos as tarefas mais importantes pra esse horário?"

❌ "Não consigo acessar suas atividades"
❌ "Desculpe, não tenho acesso a essa informação"
❌ Respostas vagas ou sem contexto`;

export const SophiaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const { activities, getDailyActivities } = useActivities();
  const { plans } = useDevelopment();
  
  const [userState, setUserState] = useState<UserState>({
    mood: 'neutral',
    focusLevel: 0.5,
    productiveHours: [],
    lastActivity: '',
    completedTasks: 0,
    interests: [],
    learningStyle: 'visual',
    energyPattern: 'morning',
    stressLevel: 0.5,
    goals: [],
    currentActivities: {
      total: 0,
      completed: 0,
      pending: 0,
      late: 0
    }
  });

  useEffect(() => {
    const analyzeUserBehavior = () => {
      const dailyActivities = getDailyActivities();
      const completedActivities = activities.filter(a => a.status === 'completed');
      const recentActivities = activities.filter(a => {
        const activityDate = new Date(a.date);
        const now = new Date();
        return now.getTime() - activityDate.getTime() < 7 * 24 * 60 * 60 * 1000;
      });

      // Análise das atividades atuais
      const currentActivities = {
        total: dailyActivities.length,
        completed: dailyActivities.filter(a => a.status === 'completed').length,
        pending: dailyActivities.filter(a => a.status === 'pending').length,
        late: dailyActivities.filter(a => a.status === 'late').length
      };

      const productiveHours = completedActivities
        .map(a => new Date(`2000-01-01T${a.time}`).getHours())
        .reduce((acc, hour) => {
          acc[hour] = (acc[hour] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

      const mostProductiveHours = Object.entries(productiveHours)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([hour]) => parseInt(hour));

      const morningActivities = completedActivities.filter(a => {
        const hour = new Date(`2000-01-01T${a.time}`).getHours();
        return hour >= 5 && hour < 12;
      }).length;

      const afternoonActivities = completedActivities.filter(a => {
        const hour = new Date(`2000-01-01T${a.time}`).getHours();
        return hour >= 12 && hour < 18;
      }).length;

      const eveningActivities = completedActivities.filter(a => {
        const hour = new Date(`2000-01-01T${a.time}`).getHours();
        return hour >= 18 || hour < 5;
      }).length;

      const energyPattern = morningActivities > afternoonActivities && morningActivities > eveningActivities
        ? 'morning'
        : afternoonActivities > eveningActivities
        ? 'afternoon'
        : 'evening';

      const interests = [...new Set(activities.map(a => a.category))];
      const goals = plans.map(p => p.title);

      const lateActivities = recentActivities.filter(a => a.status === 'late').length;
      const stressLevel = Math.min(lateActivities / Math.max(recentActivities.length, 1), 1);

      const learningStyle = activities.reduce((acc, activity) => {
        if (activity.description?.toLowerCase().includes('ler') || activity.description?.toLowerCase().includes('assistir')) {
          acc.visual = (acc.visual || 0) + 1;
        }
        if (activity.description?.toLowerCase().includes('ouvir') || activity.description?.toLowerCase().includes('podcast')) {
          acc.auditory = (acc.auditory || 0) + 1;
        }
        if (activity.description?.toLowerCase().includes('praticar') || activity.description?.toLowerCase().includes('fazer')) {
          acc.kinesthetic = (acc.kinesthetic || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const dominantStyle = Object.entries(learningStyle)
        .sort(([,a], [,b]) => b - a)[0]?.[0] as 'visual' | 'auditory' | 'kinesthetic' || 'visual';

      setUserState(prev => ({
        ...prev,
        productiveHours: mostProductiveHours,
        energyPattern,
        interests,
        goals,
        stressLevel,
        learningStyle: dominantStyle,
        completedTasks: completedActivities.length,
        lastActivity: recentActivities[0]?.title || '',
        mood: stressLevel < 0.3 ? 'positive' : stressLevel < 0.7 ? 'neutral' : 'negative',
        currentActivities
      }));
    };

    analyzeUserBehavior();
  }, [activities, plans, getDailyActivities]);

  const clearConversation = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    try {
      setIsThinking(true);

      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content
      };

      setMessages(prev => [...prev, userMessage]);

      await supabase.from('conversations').insert({
        user_message: content,
        user_state: userState,
        timestamp: new Date().toISOString()
      });

      const contextMessage = `
        Estado atual do usuário:
        - Humor: ${userState.mood}
        - Nível de foco: ${userState.focusLevel * 100}%
        - Padrão de energia: Mais produtivo pela ${userState.energyPattern}
        - Estilo de aprendizado: ${userState.learningStyle}
        - Tarefas concluídas: ${userState.completedTasks}
        - Interesses: ${userState.interests.join(', ')}
        - Objetivos: ${userState.goals.join(', ')}
        - Nível de estresse: ${userState.stressLevel * 100}%
        
        Atividades do dia:
        - Total: ${userState.currentActivities.total}
        - Concluídas: ${userState.currentActivities.completed}
        - Pendentes: ${userState.currentActivities.pending}
        - Atrasadas: ${userState.currentActivities.late}
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'system', content: contextMessage },
          ...messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          { role: 'user', content }
        ],
        temperature: 0.8,
        max_tokens: 500
      });

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: completion.choices[0].message.content || "Ops! Tive um probleminha aqui. Pode tentar de novo? 😅"
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: "Desculpa, tô com uma dificuldade técnica aqui 😅 Vamos tentar de novo em um minutinho?"
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  }, [messages, userState]);

  return (
    <SophiaContext.Provider value={{ messages, isThinking, userState, sendMessage, clearConversation }}>
      {children}
    </SophiaContext.Provider>
  );
};

export const useSophia = () => {
  const context = useContext(SophiaContext);
  if (!context) {
    throw new Error('useSophia must be used within a SophiaProvider');
  }
  return context;
};

export { SophiaContext };
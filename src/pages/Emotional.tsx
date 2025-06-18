import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smile, Frown, Meh, Brain, Heart, ArrowUp, ArrowDown, TrendingUp, 
  Calendar, Clock, Sparkles, X, Plus, BookOpen, Music, Coffee, 
  Yoga, Sun, Moon, Zap, Target, AlertCircle, CheckCircle, Star,
  BarChart3, Activity, Lightbulb, MessageCircle, Timer, Play,
  Pause, RotateCcw, Volume2, VolumeX, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSophia } from '../contexts/SophiaContext';

type Emotion = 'happy' | 'sad' | 'anxious' | 'calm' | 'energetic' | 'tired' | 'angry' | 'excited' | 'confused' | 'grateful';

interface EmotionEntry {
  id: string;
  emotion: Emotion;
  intensity: number;
  timestamp: string;
  note?: string;
  triggers?: string[];
  location?: string;
  weather?: string;
  activities?: string[];
}

interface EmotionPattern {
  timeOfDay: { [key: string]: number };
  dayOfWeek: { [key: string]: number };
  triggers: { [key: string]: number };
  averageIntensity: number;
  trend: 'improving' | 'declining' | 'stable';
}

interface TechniqueSession {
  id: string;
  technique: string;
  duration: number;
  completed: boolean;
  helpfulness: number;
  timestamp: string;
}

export const Emotional: React.FC = () => {
  const { sendMessage } = useSophia();
  
  // Estados principais
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [customTrigger, setCustomTrigger] = useState('');
  const [emotionHistory, setEmotionHistory] = useState<EmotionEntry[]>([]);
  const [patterns, setPatterns] = useState<EmotionPattern | null>(null);
  const [wellbeingScore, setWellbeingScore] = useState(0);
  const [weeklyReport, setWeeklyReport] = useState<any>(null);
  
  // Estados da interface
  const [showTechniqueModal, setShowTechniqueModal] = useState(false);
  const [activeTechnique, setActiveTechnique] = useState<string | null>(null);
  const [techniqueTimer, setTechniqueTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const [currentView, setCurrentView] = useState<'register' | 'history' | 'patterns' | 'techniques'>('register');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Dados das emoções
  const emotions = [
    { id: 'happy', icon: Smile, label: 'Feliz', color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' },
    { id: 'sad', icon: Frown, label: 'Triste', color: 'text-blue-500', bgColor: 'bg-blue-500/20' },
    { id: 'anxious', icon: Brain, label: 'Ansioso', color: 'text-red-500', bgColor: 'bg-red-500/20' },
    { id: 'calm', icon: Heart, label: 'Calmo', color: 'text-green-500', bgColor: 'bg-green-500/20' },
    { id: 'energetic', icon: Zap, label: 'Energético', color: 'text-purple-500', bgColor: 'bg-purple-500/20' },
    { id: 'tired', icon: Moon, label: 'Cansado', color: 'text-gray-500', bgColor: 'bg-gray-500/20' },
    { id: 'angry', icon: AlertCircle, label: 'Irritado', color: 'text-orange-500', bgColor: 'bg-orange-500/20' },
    { id: 'excited', icon: Star, label: 'Animado', color: 'text-pink-500', bgColor: 'bg-pink-500/20' },
    { id: 'confused', icon: Meh, label: 'Confuso', color: 'text-indigo-500', bgColor: 'bg-indigo-500/20' },
    { id: 'grateful', icon: Sun, label: 'Grato', color: 'text-emerald-500', bgColor: 'bg-emerald-500/20' }
  ] as const;

  // Gatilhos emocionais comuns
  const commonTriggers = [
    'Trabalho', 'Relacionamentos', 'Saúde', 'Finanças', 'Família',
    'Trânsito', 'Redes Sociais', 'Notícias', 'Clima', 'Sono',
    'Alimentação', 'Exercício', 'Música', 'Solidão', 'Pressão'
  ];

  // Técnicas de regulação emocional
  const techniques = [
    {
      id: 'breathing',
      title: 'Respiração 4-7-8',
      description: 'Técnica de respiração para reduzir ansiedade',
      duration: 300, // 5 minutos
      icon: Sun,
      color: 'blue',
      steps: [
        'Expire completamente pela boca',
        'Feche a boca e inspire pelo nariz contando até 4',
        'Segure a respiração contando até 7',
        'Expire pela boca contando até 8',
        'Repita o ciclo 4 vezes'
      ]
    },
    {
      id: 'grounding',
      title: 'Técnica 5-4-3-2-1',
      description: 'Ancoragem sensorial para ansiedade',
      duration: 600, // 10 minutos
      icon: Target,
      color: 'green',
      steps: [
        'Identifique 5 coisas que você pode VER',
        'Identifique 4 coisas que você pode TOCAR',
        'Identifique 3 coisas que você pode OUVIR',
        'Identifique 2 coisas que você pode CHEIRAR',
        'Identifique 1 coisa que você pode PROVAR'
      ]
    },
    {
      id: 'meditation',
      title: 'Meditação Mindfulness',
      description: 'Meditação guiada para clareza mental',
      duration: 900, // 15 minutos
      icon: Brain,
      color: 'purple',
      steps: [
        'Sente-se confortavelmente',
        'Feche os olhos suavemente',
        'Concentre-se na sua respiração',
        'Observe os pensamentos sem julgamento',
        'Retorne o foco à respiração quando necessário'
      ]
    },
    {
      id: 'bodyscan',
      title: 'Escaneamento Corporal',
      description: 'Relaxamento progressivo do corpo',
      duration: 1200, // 20 minutos
      icon: Activity,
      color: 'teal',
      steps: [
        'Deite-se confortavelmente',
        'Comece pelos pés, tensione e relaxe',
        'Suba pelas pernas, quadris, abdômen',
        'Continue pelos braços, ombros, pescoço',
        'Termine pela cabeça e rosto'
      ]
    }
  ];

  // Carregar dados do localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('emotion_history');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setEmotionHistory(history);
      analyzePatterns(history);
      calculateWellbeingScore(history);
    }
  }, []);

  // Timer para técnicas
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && techniqueTimer > 0) {
      interval = setInterval(() => {
        setTechniqueTimer(prev => prev - 1);
      }, 1000);
    } else if (techniqueTimer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Técnica concluída
      handleTechniqueComplete();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, techniqueTimer]);

  // Registrar emoção
  const handleEmotionSubmit = () => {
    if (!selectedEmotion) return;

    const newEntry: EmotionEntry = {
      id: crypto.randomUUID(),
      emotion: selectedEmotion,
      intensity: emotionIntensity,
      timestamp: new Date().toISOString(),
      note: note.trim() || undefined,
      triggers: selectedTriggers.length > 0 ? selectedTriggers : undefined
    };

    const updatedHistory = [newEntry, ...emotionHistory];
    setEmotionHistory(updatedHistory);
    localStorage.setItem('emotion_history', JSON.stringify(updatedHistory));

    // Analisar padrões e calcular score
    analyzePatterns(updatedHistory);
    calculateWellbeingScore(updatedHistory);

    // Enviar para Sophia
    const emotionData = emotions.find(e => e.id === selectedEmotion);
    const triggerText = selectedTriggers.length > 0 ? ` Gatilhos: ${selectedTriggers.join(', ')}.` : '';
    const noteText = note ? ` Observação: ${note}` : '';
    
    sendMessage(`Registrei que estou me sentindo ${emotionData?.label.toLowerCase()} com intensidade ${emotionIntensity}/10.${triggerText}${noteText} Pode me ajudar com isso?`);

    // Resetar formulário
    setSelectedEmotion(null);
    setEmotionIntensity(5);
    setNote('');
    setSelectedTriggers([]);
    setCustomTrigger('');

    // Mostrar mensagem de sucesso
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);

    // Sugerir técnica se emoção negativa
    if (['sad', 'anxious', 'angry', 'confused'].includes(selectedEmotion) && emotionIntensity >= 6) {
      setTimeout(() => {
        setShowTechniqueModal(true);
      }, 2000);
    }
  };

  // Analisar padrões emocionais
  const analyzePatterns = (history: EmotionEntry[]) => {
    if (history.length < 3) return;

    const timeOfDay: { [key: string]: number } = {};
    const dayOfWeek: { [key: string]: number } = {};
    const triggers: { [key: string]: number } = {};
    let totalIntensity = 0;

    history.forEach(entry => {
      const date = new Date(entry.timestamp);
      const hour = date.getHours();
      const day = date.getDay();

      // Análise por período do dia
      const period = hour < 6 ? 'madrugada' : 
                   hour < 12 ? 'manhã' : 
                   hour < 18 ? 'tarde' : 'noite';
      timeOfDay[period] = (timeOfDay[period] || 0) + 1;

      // Análise por dia da semana
      const dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
      dayOfWeek[dayNames[day]] = (dayOfWeek[dayNames[day]] || 0) + 1;

      // Análise de gatilhos
      entry.triggers?.forEach(trigger => {
        triggers[trigger] = (triggers[trigger] || 0) + 1;
      });

      totalIntensity += entry.intensity;
    });

    // Calcular tendência
    const recent = history.slice(0, 7);
    const older = history.slice(7, 14);
    const recentAvg = recent.reduce((sum, e) => sum + e.intensity, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, e) => sum + e.intensity, 0) / older.length : recentAvg;
    
    const trend = recentAvg > olderAvg + 0.5 ? 'improving' : 
                 recentAvg < olderAvg - 0.5 ? 'declining' : 'stable';

    setPatterns({
      timeOfDay,
      dayOfWeek,
      triggers,
      averageIntensity: totalIntensity / history.length,
      trend
    });
  };

  // Calcular score de bem-estar
  const calculateWellbeingScore = (history: EmotionEntry[]) => {
    if (history.length === 0) {
      setWellbeingScore(50);
      return;
    }

    const weights = {
      happy: 1, grateful: 0.9, excited: 0.8, calm: 0.7, energetic: 0.6,
      confused: 0, tired: -0.2, sad: -0.4, anxious: -0.6, angry: -0.8
    };

    const recentEntries = history.slice(0, 14); // Últimas 2 semanas
    const totalScore = recentEntries.reduce((acc, entry) => {
      const baseScore = weights[entry.emotion] || 0;
      const intensityFactor = entry.intensity / 10;
      return acc + (baseScore * intensityFactor);
    }, 0);

    const averageScore = (totalScore / recentEntries.length + 1) * 50;
    setWellbeingScore(Math.round(Math.max(0, Math.min(100, averageScore))));
  };

  // Adicionar gatilho personalizado
  const addCustomTrigger = () => {
    if (customTrigger.trim() && !selectedTriggers.includes(customTrigger.trim())) {
      setSelectedTriggers([...selectedTriggers, customTrigger.trim()]);
      setCustomTrigger('');
    }
  };

  // Iniciar técnica
  const startTechnique = (technique: any) => {
    setActiveTechnique(technique.id);
    setTechniqueTimer(technique.duration);
    setIsTimerRunning(true);
    setShowTechniqueModal(false);
  };

  // Completar técnica
  const handleTechniqueComplete = () => {
    // Aqui você pode salvar dados sobre a sessão da técnica
    setActiveTechnique(null);
    setTechniqueTimer(0);
    
    // Perguntar sobre a eficácia
    setTimeout(() => {
      const helpfulness = window.confirm('Esta técnica te ajudou? Clique OK se sim, Cancelar se não.');
      // Salvar feedback da técnica
    }, 1000);
  };

  // Formatar tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Gerar relatório semanal
  const generateWeeklyReport = () => {
    const lastWeek = emotionHistory.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    if (lastWeek.length === 0) return null;

    const emotionCounts: { [key: string]: number } = {};
    let bestDay = '';
    let worstDay = '';
    let bestScore = 0;
    let worstScore = 10;

    lastWeek.forEach(entry => {
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
      
      const dayName = new Date(entry.timestamp).toLocaleDateString('pt-BR', { weekday: 'long' });
      if (entry.intensity > bestScore) {
        bestScore = entry.intensity;
        bestDay = dayName;
      }
      if (entry.intensity < worstScore) {
        worstScore = entry.intensity;
        worstDay = dayName;
      }
    });

    const predominantEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    return {
      predominantEmotion,
      bestDay,
      worstDay,
      totalEntries: lastWeek.length,
      averageIntensity: lastWeek.reduce((sum, e) => sum + e.intensity, 0) / lastWeek.length
    };
  };

  const getEmotionData = (emotionId: string) => {
    return emotions.find(e => e.id === emotionId);
  };

  return (
    <div className="space-y-6">
      {/* Mensagem de Sucesso */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center gap-3"
          >
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-500">Emoção registrada com sucesso!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer da Técnica Ativa */}
      <AnimatePresence>
        {activeTechnique && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-800 rounded-xl p-8 border border-gray-700 text-center"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              {techniques.find(t => t.id === activeTechnique)?.title}
            </h3>
            <div className="text-4xl font-bold text-blue-500 mb-4">
              {formatTime(techniqueTimer)}
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                variant="secondary"
              >
                {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                onClick={() => {
                  setActiveTechnique(null);
                  setTechniqueTimer(0);
                  setIsTimerRunning(false);
                }}
                variant="secondary"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Bem-Estar Emocional</h1>
          <p className="text-gray-400">Acompanhe e gerencie suas emoções</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowWeeklyReport(true)}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Relatório Semanal
          </Button>
          <Button
            onClick={() => setShowTechniqueModal(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Técnicas de Apoio
          </Button>
        </div>
      </div>

      {/* Navegação */}
      <div className="flex items-center gap-2 border-b border-gray-700">
        {[
          { id: 'register', label: 'Registrar', icon: Plus },
          { id: 'history', label: 'Histórico', icon: Calendar },
          { id: 'patterns', label: 'Padrões', icon: TrendingUp },
          { id: 'techniques', label: 'Técnicas', icon: Heart }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              currentView === tab.id
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Score de Bem-estar */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg className="w-24 h-24">
              <circle
                className="text-gray-700"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="48"
                cy="48"
              />
              <circle
                className={wellbeingScore > 70 ? 'text-green-500' : wellbeingScore > 40 ? 'text-yellow-500' : 'text-red-500'}
                strokeWidth="8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="48"
                cy="48"
                strokeDasharray={`${wellbeingScore * 2.51} 251`}
                transform="rotate(-90 48 48)"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-2xl font-bold text-white">{wellbeingScore}</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-white mb-2">Score de Bem-estar</h3>
            <p className="text-gray-300">
              {wellbeingScore > 70 ? 'Você está se sentindo muito bem! Continue assim.' :
               wellbeingScore > 40 ? 'Seu bem-estar está equilibrado. Que tal algumas técnicas de apoio?' :
               'Parece que você precisa de um cuidado extra. Vamos trabalhar juntos nisso.'}
            </p>
            {patterns?.trend && (
              <div className="flex items-center gap-2 mt-2">
                {patterns.trend === 'improving' ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : patterns.trend === 'declining' ? (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                )}
                <span className="text-sm text-gray-400">
                  Tendência: {patterns.trend === 'improving' ? 'Melhorando' : 
                             patterns.trend === 'declining' ? 'Precisando atenção' : 'Estável'}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          {currentView === 'register' && (
            <Card>
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-white text-center mb-6">
                  Como você está se sentindo hoje?
                </h3>
                
                {/* Grade de Emoções */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {emotions.map(emotion => (
                    <button
                      key={emotion.id}
                      onClick={() => setSelectedEmotion(emotion.id)}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all hover:scale-105 ${
                        selectedEmotion === emotion.id
                          ? `${emotion.bgColor} border-current ${emotion.color}`
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <emotion.icon className={`h-8 w-8 ${emotion.color}`} />
                      <span className="text-sm font-medium text-white">{emotion.label}</span>
                    </button>
                  ))}
                </div>

                {selectedEmotion && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 pt-6 border-t border-gray-700"
                  >
                    {/* Intensidade */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Intensidade da emoção
                      </label>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">1</span>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={emotionIntensity}
                          onChange={(e) => setEmotionIntensity(parseInt(e.target.value))}
                          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm text-gray-400">10</span>
                        <span className="text-lg font-bold text-white min-w-[2rem]">
                          {emotionIntensity}
                        </span>
                      </div>
                    </div>

                    {/* Gatilhos */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        O que pode ter causado essa emoção? (opcional)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {commonTriggers.map(trigger => (
                          <button
                            key={trigger}
                            onClick={() => {
                              if (selectedTriggers.includes(trigger)) {
                                setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
                              } else {
                                setSelectedTriggers([...selectedTriggers, trigger]);
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              selectedTriggers.includes(trigger)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {trigger}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customTrigger}
                          onChange={(e) => setCustomTrigger(e.target.value)}
                          placeholder="Adicionar gatilho personalizado..."
                          className="flex-1 px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400"
                          onKeyPress={(e) => e.key === 'Enter' && addCustomTrigger()}
                        />
                        <Button onClick={addCustomTrigger} variant="secondary">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Notas */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Quer compartilhar mais detalhes? (opcional)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Descreva como você está se sentindo, o que aconteceu hoje..."
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleEmotionSubmit}
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Registrar Emoção
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          )}

          {currentView === 'history' && (
            <Card title="Histórico Emocional">
              <div className="space-y-4">
                {emotionHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma emoção registrada ainda</p>
                    <p className="text-sm">Comece registrando como você se sente hoje</p>
                  </div>
                ) : (
                  emotionHistory.slice(0, 10).map(entry => {
                    const emotionData = getEmotionData(entry.emotion);
                    if (!emotionData) return null;
                    
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg"
                      >
                        <div className={`p-2 rounded-lg ${emotionData.bgColor}`}>
                          <emotionData.icon className={`h-5 w-5 ${emotionData.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-white">{emotionData.label}</span>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                              <Clock className="h-4 w-4 ml-2" />
                              <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <span>Intensidade: {entry.intensity}/10</span>
                            {entry.triggers && entry.triggers.length > 0 && (
                              <>
                                <span>•</span>
                                <span>Gatilhos: {entry.triggers.join(', ')}</span>
                              </>
                            )}
                          </div>
                          {entry.note && (
                            <p className="text-sm text-gray-300">{entry.note}</p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </Card>
          )}

          {currentView === 'patterns' && patterns && (
            <Card title="Análise de Padrões">
              <div className="space-y-6">
                {/* Padrões por período do dia */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Emoções por Período do Dia</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(patterns.timeOfDay).map(([period, count]) => (
                      <div key={period} className="bg-gray-800/50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{count}</div>
                        <div className="text-sm text-gray-400 capitalize">{period}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gatilhos mais comuns */}
                {Object.keys(patterns.triggers).length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Gatilhos Mais Frequentes</h4>
                    <div className="space-y-2">
                      {Object.entries(patterns.triggers)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([trigger, count]) => (
                          <div key={trigger} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                            <span className="text-gray-300">{trigger}</span>
                            <span className="text-white font-medium">{count}x</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Insights */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-500 mb-2">
                    <Lightbulb className="h-5 w-5" />
                    <span className="font-medium">Insights Personalizados</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    {patterns.averageIntensity > 7 && (
                      <p>• Suas emoções têm sido intensas. Considere técnicas de regulação emocional.</p>
                    )}
                    {patterns.timeOfDay.manhã > patterns.timeOfDay.noite && (
                      <p>• Você registra mais emoções pela manhã. Seu humor matinal influencia o dia.</p>
                    )}
                    {patterns.trend === 'improving' && (
                      <p>• Parabéns! Seu bem-estar emocional está melhorando consistentemente.</p>
                    )}
                    {patterns.trend === 'declining' && (
                      <p>• Notamos uma tendência de declínio. Que tal conversar com a Sophia sobre isso?</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {currentView === 'techniques' && (
            <Card title="Técnicas de Regulação Emocional">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {techniques.map(technique => (
                  <motion.div
                    key={technique.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-lg bg-${technique.color}-500/10 border border-${technique.color}-500/20`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <technique.icon className={`h-6 w-6 text-${technique.color}-500`} />
                      <h3 className="text-lg font-medium text-white">{technique.title}</h3>
                    </div>
                    <p className="text-gray-400 mb-4">{technique.description}</p>
                    <div className="text-sm text-gray-400 mb-4">
                      Duração: {Math.floor(technique.duration / 60)} minutos
                    </div>
                    <div className="space-y-2 mb-4">
                      {technique.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-blue-500 font-medium">{index + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => startTechnique(technique)}
                      className={`w-full bg-${technique.color}-600 hover:bg-${technique.color}-700`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar Técnica
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Ações Rápidas */}
          <Card title="Ações Rápidas">
            <div className="space-y-3">
              <Button
                onClick={() => setCurrentView('register')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Registrar Emoção
              </Button>
              <Button
                onClick={() => setShowTechniqueModal(true)}
                variant="secondary"
                className="w-full"
              >
                <Heart className="h-4 w-4 mr-2" />
                Técnicas de Apoio
              </Button>
              <Button
                onClick={() => sendMessage('Como posso melhorar meu bem-estar emocional hoje?')}
                variant="secondary"
                className="w-full"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Conversar com Sophia
              </Button>
            </div>
          </Card>

          {/* Resumo Rápido */}
          {emotionHistory.length > 0 && (
            <Card title="Resumo da Semana">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Registros esta semana</span>
                  <span className="text-white font-medium">
                    {emotionHistory.filter(e => {
                      const entryDate = new Date(e.timestamp);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return entryDate >= weekAgo;
                    }).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Emoção mais comum</span>
                  <span className="text-white font-medium">
                    {(() => {
                      const weekEmotions = emotionHistory.filter(e => {
                        const entryDate = new Date(e.timestamp);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return entryDate >= weekAgo;
                      });
                      
                      const counts: { [key: string]: number } = {};
                      weekEmotions.forEach(e => {
                        counts[e.emotion] = (counts[e.emotion] || 0) + 1;
                      });
                      
                      const mostCommon = Object.entries(counts)
                        .sort(([,a], [,b]) => b - a)[0];
                      
                      if (mostCommon) {
                        const emotionData = getEmotionData(mostCommon[0]);
                        return emotionData?.label || 'N/A';
                      }
                      return 'N/A';
                    })()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Intensidade média</span>
                  <span className="text-white font-medium">
                    {(() => {
                      const weekEmotions = emotionHistory.filter(e => {
                        const entryDate = new Date(e.timestamp);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return entryDate >= weekAgo;
                      });
                      
                      if (weekEmotions.length === 0) return 'N/A';
                      
                      const avg = weekEmotions.reduce((sum, e) => sum + e.intensity, 0) / weekEmotions.length;
                      return `${avg.toFixed(1)}/10`;
                    })()}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Dicas Personalizadas */}
          <Card title="Dicas Personalizadas">
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-500 mb-2">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-medium">Dica do Dia</span>
                </div>
                <p className="text-sm text-gray-300">
                  Pratique a gratidão: liste 3 coisas pelas quais você é grato hoje. Isso pode melhorar significativamente seu humor.
                </p>
              </div>

              {wellbeingScore < 50 && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-500 mb-2">
                    <Heart className="h-5 w-5" />
                    <span className="font-medium">Cuidado Extra</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Seu bem-estar precisa de atenção. Que tal experimentar uma técnica de respiração ou conversar com a Sophia?
                  </p>
                </div>
              )}

              {patterns?.trend === 'improving' && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-purple-500 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-medium">Parabéns!</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Seu bem-estar emocional está melhorando! Continue com as práticas que têm funcionado para você.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Técnicas */}
      <AnimatePresence>
        {showTechniqueModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowTechniqueModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-semibold text-white mb-6">Técnicas de Regulação Emocional</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {techniques.map(technique => (
                  <div
                    key={technique.id}
                    className={`p-4 rounded-lg bg-${technique.color}-500/10 border border-${technique.color}-500/20`}
                  >
                    <technique.icon className={`h-6 w-6 text-${technique.color}-500 mb-2`} />
                    <h3 className="text-lg font-medium text-white mb-2">{technique.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{technique.description}</p>
                    <Button
                      onClick={() => startTechnique(technique)}
                      className={`w-full bg-${technique.color}-600 hover:bg-${technique.color}-700`}
                    >
                      Iniciar ({Math.floor(technique.duration / 60)} min)
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Relatório Semanal */}
      <AnimatePresence>
        {showWeeklyReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-lg relative"
            >
              <button
                onClick={() => setShowWeeklyReport(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-semibold text-white mb-6">Relatório Semanal</h2>

              {(() => {
                const report = generateWeeklyReport();
                if (!report) {
                  return (
                    <p className="text-gray-400 text-center py-8">
                      Registre suas emoções durante a semana para ver seu relatório.
                    </p>
                  );
                }

                const emotionData = getEmotionData(report.predominantEmotion);

                return (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{wellbeingScore}/100</div>
                      <p className="text-gray-400">Score de Bem-estar Semanal</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <span className="text-gray-300">Emoção predominante</span>
                        <div className="flex items-center gap-2">
                          {emotionData && <emotionData.icon className={`h-4 w-4 ${emotionData.color}`} />}
                          <span className="text-white">{emotionData?.label}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <span className="text-gray-300">Melhor dia</span>
                        <span className="text-white">{report.bestDay}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <span className="text-gray-300">Registros feitos</span>
                        <span className="text-white">{report.totalEntries}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <span className="text-gray-300">Intensidade média</span>
                        <span className="text-white">{report.averageIntensity.toFixed(1)}/10</span>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <h4 className="font-medium text-blue-500 mb-2">Sugestões para a próxima semana:</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {report.averageIntensity < 5 && (
                          <li>• Pratique técnicas de regulação emocional diariamente</li>
                        )}
                        <li>• Continue registrando suas emoções para melhor autoconhecimento</li>
                        <li>• Converse com a Sophia sobre padrões que você notou</li>
                        {wellbeingScore > 70 && (
                          <li>• Você está indo muito bem! Mantenha suas práticas atuais</li>
                        )}
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
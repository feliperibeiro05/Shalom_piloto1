import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat, Clock, Zap, Calendar, Plus, Pencil, Trash, Sparkles } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useDevelopment } from '../../../contexts/DevelopmentContext';

interface Habit {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly';
  timeOfDay?: string;
  streak: number;
  lastCompleted?: string;
  isCustom?: boolean;
}

interface HabitBuilderProps {
  habits: Habit[];
  planId: string;
}

export const HabitBuilder: React.FC<HabitBuilderProps> = ({ habits, planId }) => {
  const { updateHabitStreak, addCustomHabit, editHabit, deleteHabit } = useDevelopment();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'daily' as const,
    timeOfDay: ''
  });

  // Filter out only custom habits created by the user
  const customHabits = habits.filter(h => h.isCustom);

  const handleStreak = (habitId: string, dayNumber: number) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    
    // If already completed today, don't allow another completion
    if (habit.lastCompleted === today) {
      return;
    }

    // Check if the streak should be broken (more than one day passed)
    if (habit.lastCompleted) {
      const lastCompletedDate = new Date(habit.lastCompleted);
      const currentDate = new Date();
      const daysDifference = Math.floor((currentDate.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDifference > 1) {
        // Reset streak if more than one day has passed
        updateHabitStreak(planId, habitId, 1);
        return;
      }
    }

    // Calculate visual day number (1-7)
    const visualDayNumber = ((habit.streak % 7) + 1);

    // Only allow clicking the next day in sequence
    if (dayNumber !== visualDayNumber) {
      return;
    }

    // Update streak (actual streak continues to increment)
    const newStreak = habit.streak + 1;
    updateHabitStreak(planId, habitId, newStreak);
  };

  const getVisualDayNumber = (streak: number) => {
    return streak === 0 ? 0 : (streak - 1) % 7 + 1;
  };

  const handleAddHabit = () => {
    if (formData.title && formData.description) {
      addCustomHabit(planId, formData);
      setFormData({
        title: '',
        description: '',
        frequency: 'daily',
        timeOfDay: ''
      });
      setShowAddForm(false);
    }
  };

  const handleEdit = (habit: Habit) => {
    setEditingId(habit.id);
    setFormData({
      title: habit.title,
      description: habit.description,
      frequency: habit.frequency,
      timeOfDay: habit.timeOfDay || ''
    });
  };

  const handleSaveEdit = (habitId: string) => {
    editHabit(planId, habitId, formData);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      frequency: 'daily',
      timeOfDay: ''
    });
  };

  return (
    <div className="space-y-6">
      <Card title="Construtor de Hábitos">
        {customHabits.length === 0 ? (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg text-center">
              <Sparkles className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Crie Seus Próprios Hábitos</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Defina hábitos personalizados para desenvolver consistência e alcançar seus objetivos mais rapidamente.
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-green-600 to-blue-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Meu Primeiro Hábito
              </Button>
            </div>

            {/* Add New Habit Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
                >
                  <h4 className="text-lg font-medium text-white mb-4">Novo Hábito</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Título
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Ex: Prática diária de código"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Descrição
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        rows={3}
                        placeholder="Descreva o hábito que você quer desenvolver"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Frequência
                        </label>
                        <select
                          value={formData.frequency}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            frequency: e.target.value as 'daily' | 'weekly'
                          }))}
                          className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="daily">Diário</option>
                          <option value="weekly">Semanal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Horário
                        </label>
                        <input
                          type="time"
                          value={formData.timeOfDay}
                          onChange={(e) => setFormData(prev => ({ ...prev, timeOfDay: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="secondary"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAddHabit}
                        disabled={!formData.title || !formData.description}
                        className="bg-gradient-to-r from-green-600 to-blue-600"
                      >
                        Criar Hábito
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-gray-700 pt-6">
              <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                <Sparkles className="h-5 w-5 text-green-500 mr-2" />
                Exemplos de Hábitos
              </h4>
              <div className="space-y-4">
                {[
                  {
                    title: 'Prática Diária',
                    description: 'Dedique 30 minutos todos os dias para praticar e desenvolver suas habilidades',
                    frequency: 'daily',
                    timeOfDay: '08:00'
                  },
                  {
                    title: 'Revisão Semanal',
                    description: 'Reserve um tempo para revisar seu progresso e planejar a próxima semana',
                    frequency: 'weekly',
                    timeOfDay: '18:00'
                  },
                  {
                    title: 'Leitura Técnica',
                    description: 'Leia artigos, livros ou documentação relacionada à sua área de desenvolvimento',
                    frequency: 'daily',
                    timeOfDay: '20:00'
                  }
                ].map((example, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-white mb-1">{example.title}</h5>
                        <p className="text-sm text-gray-400">{example.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Repeat className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-400">
                          {example.frequency === 'daily' ? 'Diário' : 'Semanal'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{example.timeOfDay}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {customHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-lg p-4"
              >
                {editingId === habit.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600"
                      placeholder="Título do hábito"
                    />
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600"
                      placeholder="Descrição"
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <select
                          value={formData.frequency}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            frequency: e.target.value as 'daily' | 'weekly'
                          }))}
                          className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600"
                        >
                          <option value="daily">Diário</option>
                          <option value="weekly">Semanal</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="time"
                          value={formData.timeOfDay}
                          onChange={(e) => setFormData(prev => ({ ...prev, timeOfDay: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setEditingId(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => handleSaveEdit(habit.id)}
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-white mb-1">{habit.title}</h4>
                        <p className="text-sm text-gray-400">{habit.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(habit)}
                          className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Pencil className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => deleteHabit(planId, habit.id)}
                          className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Trash className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">{habit.timeOfDay}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-gray-400">
                          {habit.streak} dias seguidos
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">
                          {habit.lastCompleted ? new Date(habit.lastCompleted).toLocaleDateString() : 'Não iniciado'}
                        </span>
                      </div>
                    </div>

                    {/* Streak Progress */}
                    <div className="mt-4">
                      <div className="flex gap-1">
                        {[...Array(7)].map((_, i) => {
                          const dayNumber = i + 1;
                          const visualStreak = getVisualDayNumber(habit.streak);
                          const isClickable = dayNumber === visualStreak + 1;
                          const isCompleted = dayNumber <= visualStreak;
                          
                          return (
                            <button
                              key={i}
                              onClick={() => isClickable && handleStreak(habit.id, dayNumber)}
                              disabled={!isClickable}
                              className={`
                                w-8 h-8 rounded-lg flex items-center justify-center text-sm
                                transition-colors
                                ${isCompleted 
                                  ? 'bg-green-500/20 text-green-500' 
                                  : isClickable
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                }
                              `}
                            >
                              {dayNumber}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}

            {/* Add New Habit Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowAddForm(true)}
              className="w-full p-4 rounded-lg border border-dashed border-gray-700 hover:border-green-500 hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-green-500"
            >
              <Plus className="h-5 w-5" />
              Adicionar Novo Hábito
            </motion.button>

            {/* Add New Habit Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
                >
                  <h4 className="text-lg font-medium text-white mb-4">Novo Hábito</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Título
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Ex: Prática diária de código"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Descrição
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        rows={3}
                        placeholder="Descreva o hábito que você quer desenvolver"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Frequência
                        </label>
                        <select
                          value={formData.frequency}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            frequency: e.target.value as 'daily' | 'weekly'
                          }))}
                          className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="daily">Diário</option>
                          <option value="weekly">Semanal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Horário
                        </label>
                        <input
                          type="time"
                          value={formData.timeOfDay}
                          onChange={(e) => setFormData(prev => ({ ...prev, timeOfDay: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="secondary"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAddHabit}
                        disabled={!formData.title || !formData.description}
                        className="bg-gradient-to-r from-green-600 to-blue-600"
                      >
                        Criar Hábito
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </Card>
    </div>
  );
};
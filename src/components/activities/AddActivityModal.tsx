import React, { useState } from 'react';
import { X, Clock, Calendar, Flag, Target, Repeat, ListTodo, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useActivities } from '../../contexts/ActivitiesContext';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WEEK_DAYS = [
  { short: 'D', long: 'Domingo', value: 'sunday' },
  { short: 'S', long: 'Segunda', value: 'monday' },
  { short: 'T', long: 'Terça', value: 'tuesday' },
  { short: 'Q', long: 'Quarta', value: 'wednesday' },
  { short: 'Q', long: 'Quinta', value: 'thursday' },
  { short: 'S', long: 'Sexta', value: 'friday' },
  { short: 'S', long: 'Sábado', value: 'saturday' }
];

export const AddActivityModal: React.FC<AddActivityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addActivity } = useActivities();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    priority: 'medium' as const,
    category: 'personal' as const,
    type: 'daily' as const,
    frequency: 'daily' as const,
    endDate: '',
    weekDays: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.type === 'routine' && formData.weekDays.length === 0) {
      alert('Selecione pelo menos um dia da semana para a rotina');
      return;
    }

    // Se for uma rotina, criar uma atividade para cada dia selecionado
    if (formData.type === 'routine') {
      const startDate = new Date(formData.date);
      const endDate = formData.endDate ? new Date(formData.endDate) : new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1); // Se não houver data final, criar para 1 mês

      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay();
        const dayName = WEEK_DAYS[dayOfWeek].value;
        
        if (formData.weekDays.includes(dayName)) {
          addActivity({
            ...formData,
            date: date.toISOString().split('T')[0],
            isRoutine: true,
          });
        }
      }
    } else {
      addActivity(formData);
    }

    onClose();
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      priority: 'medium',
      category: 'personal',
      type: 'daily',
      frequency: 'daily',
      endDate: '',
      weekDays: [],
    });
  };

  const toggleWeekDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      weekDays: prev.weekDays.includes(day)
        ? prev.weekDays.filter(d => d !== day)
        : [...prev.weekDays, day]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Nova Atividade</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Atividade */}
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'goal' })}
              className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                formData.type === 'goal'
                  ? 'bg-blue-500/20 border-blue-500'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <Target className="h-5 w-5" />
              <span className="text-sm">Meta</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'daily' })}
              className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                formData.type === 'daily'
                  ? 'bg-blue-500/20 border-blue-500'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <ListTodo className="h-5 w-5" />
              <span className="text-sm">Diária</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'routine' })}
              className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                formData.type === 'routine'
                  ? 'bg-blue-500/20 border-blue-500'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <Repeat className="h-5 w-5" />
              <span className="text-sm">Rotina</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'priority' })}
              className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors ${
                formData.type === 'priority'
                  ? 'bg-blue-500/20 border-blue-500'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <Flag className="h-5 w-5" />
              <span className="text-sm">Prioridade</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Título
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {formData.type === 'routine' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dias da Semana
              </label>
              <div className="grid grid-cols-7 gap-1">
                {WEEK_DAYS.map((day, index) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleWeekDay(day.value)}
                    title={day.long}
                    className={`
                      p-2 rounded-full text-sm font-medium
                      ${formData.weekDays.includes(day.value)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                    `}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Data {formData.type === 'goal' ? 'Final' : 'Início'}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {formData.type !== 'goal' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Hora
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {formData.type === 'routine' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Data Final (opcional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.date}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Se não definir uma data final, a rotina será criada para o próximo mês
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Prioridade
            </label>
            <div className="relative">
              <Flag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="personal">Pessoal</option>
              <option value="work">Trabalho</option>
              <option value="study">Estudos</option>
              <option value="health">Saúde</option>
              <option value="finance">Finanças</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Adicionar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
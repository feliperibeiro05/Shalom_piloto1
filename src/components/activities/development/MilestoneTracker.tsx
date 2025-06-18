import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Calendar, Plus, Pencil, Trash, Sparkles, Lightbulb } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useDevelopment } from '../../../contexts/DevelopmentContext';

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  isCustom?: boolean;
  completedDate?: string;
}

interface MilestoneTrackerProps {
  milestones: Milestone[];
  planId: string;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ milestones, planId }) => {
  const { 
    toggleMilestone, 
    addCustomMilestone, 
    editMilestone,
    deleteMilestone,
    updatePlanProgress 
  } = useDevelopment();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    dueDate: ''
  });

  // Filter out only custom milestones created by the user
  const customMilestones = milestones.filter(m => m.isCustom);

  const handleAddMilestone = () => {
    if (formData.title && formData.description) {
      addCustomMilestone(planId, {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || undefined
      });
      setFormData({ title: '', description: '', dueDate: '' });
      setShowAddForm(false);
    }
  };

  const handleEdit = (milestone: Milestone) => {
    setEditingId(milestone.id);
    setFormData({
      title: milestone.title,
      description: milestone.description,
      dueDate: milestone.dueDate || ''
    });
  };

  const handleSaveEdit = (milestoneId: string) => {
    editMilestone(planId, milestoneId, {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate || undefined
    });
    setEditingId(null);
    setFormData({ title: '', description: '', dueDate: '' });
  };

  return (
    <div className="space-y-6">
      <Card title="Marcos do Aprendizado">
        {customMilestones.length === 0 ? (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg text-center">
              <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Crie Seus Próprios Marcos</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Defina marcos personalizados para acompanhar seu progresso e celebrar suas conquistas ao longo da jornada.
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Meu Primeiro Marco
              </Button>
            </div>

            {/* Add New Milestone Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
                >
                  <h4 className="text-lg font-medium text-white mb-4">Novo Marco</h4>
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
                        placeholder="Ex: Dominar fundamentos básicos"
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
                        placeholder="Descreva o que você pretende alcançar com este marco"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Data Prevista (opcional)
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="secondary"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAddMilestone}
                        disabled={!formData.title || !formData.description}
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        Criar Marco
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-gray-700 pt-6">
              <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
                Exemplos de Marcos
              </h4>
              <div className="space-y-4">
                {[
                  {
                    title: 'Dominar Fundamentos',
                    description: 'Compreender os conceitos básicos e princípios fundamentais da área escolhida'
                  },
                  {
                    title: 'Projeto Prático',
                    description: 'Aplicar conhecimentos em um projeto real para consolidar o aprendizado'
                  },
                  {
                    title: 'Especialização',
                    description: 'Aprofundar conhecimentos em uma área específica de interesse'
                  }
                ].map((example, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-gray-700 rounded-full">
                        <Circle className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <h5 className="font-medium text-white mb-1">{example.title}</h5>
                        <p className="text-sm text-gray-400">{example.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-0 left-6 w-0.5 h-full bg-gray-700" />

            <div className="space-y-8">
              {customMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4"
                >
                  <button
                    onClick={() => toggleMilestone(planId, milestone.id)}
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      ${milestone.completed ? 'bg-green-500/20' : 'bg-gray-800'}
                      transition-colors duration-300
                    `}
                  >
                    {milestone.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-500" />
                    )}
                  </button>

                  <div className="flex-1 bg-gray-800/50 rounded-lg p-4">
                    {editingId === milestone.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600"
                          placeholder="Título do marco"
                        />
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600"
                          placeholder="Descrição"
                          rows={3}
                        />
                        <input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => setEditingId(null)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => handleSaveEdit(milestone.id)}
                          >
                            Salvar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-white">{milestone.title}</h4>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(milestone)}
                              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <Pencil className="h-4 w-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => deleteMilestone(planId, milestone.id)}
                              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <Trash className="h-4 w-4 text-red-400" />
                            </button>
                            {milestone.dueDate && (
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(milestone.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">{milestone.description}</p>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Add New Milestone Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowAddForm(true)}
                className="w-full p-4 rounded-lg border border-dashed border-gray-700 hover:border-blue-500 hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-blue-500"
              >
                <Plus className="h-5 w-5" />
                Adicionar Novo Marco
              </motion.button>

              {/* Add New Milestone Form */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
                  >
                    <h4 className="text-lg font-medium text-white mb-4">Novo Marco</h4>
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
                          placeholder="Ex: Dominar fundamentos básicos"
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
                          placeholder="Descreva o que você pretende alcançar com este marco"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Data Prevista (opcional)
                        </label>
                        <input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          variant="secondary"
                          onClick={() => setShowAddForm(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleAddMilestone}
                          disabled={!formData.title || !formData.description}
                          className="bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                          Criar Marco
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
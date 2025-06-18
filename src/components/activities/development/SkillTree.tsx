import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronRight, Plus, Pencil, Trash, Sparkles, Lightbulb } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useDevelopment } from '../../../contexts/DevelopmentContext';

interface Skill {
  id: string;
  name: string;
  level: number;
  progress: number;
  children?: Skill[];
  isCustom?: boolean;
}

interface SkillTreeProps {
  skill: Skill;
  planId: string;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ skill, planId }) => {
  const { 
    updateSkillProgress, 
    addCustomSkill,
    editSkill,
    deleteSkill 
  } = useDevelopment();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Check if the user has any custom skills
  const hasCustomSkills = React.useMemo(() => {
    const checkForCustomSkills = (node: Skill): boolean => {
      if (node.isCustom) return true;
      if (!node.children) return false;
      return node.children.some(child => checkForCustomSkills(child));
    };
    
    return checkForCustomSkills(skill);
  }, [skill]);

  const handleAddSkill = () => {
    if (formData.name && selectedParentId) {
      addCustomSkill(planId, selectedParentId, {
        name: formData.name,
        children: []
      });
      setFormData({ name: '', description: '' });
      setShowAddForm(false);
      setSelectedParentId(null);
    }
  };

  // Example skill tree to show when user hasn't created any custom skills
  const exampleSkillTree = {
    id: 'example-root',
    name: 'Desenvolvimento Web',
    level: 2,
    progress: 40,
    isExample: true,
    children: [
      {
        id: 'example-1',
        name: 'Frontend',
        level: 3,
        progress: 60,
        isExample: true,
        children: [
          {
            id: 'example-1-1',
            name: 'HTML/CSS',
            level: 4,
            progress: 80,
            isExample: true
          },
          {
            id: 'example-1-2',
            name: 'JavaScript',
            level: 3,
            progress: 60,
            isExample: true
          },
          {
            id: 'example-1-3',
            name: 'React',
            level: 2,
            progress: 40,
            isExample: true
          }
        ]
      },
      {
        id: 'example-2',
        name: 'Backend',
        level: 2,
        progress: 30,
        isExample: true,
        children: [
          {
            id: 'example-2-1',
            name: 'Node.js',
            level: 2,
            progress: 40,
            isExample: true
          },
          {
            id: 'example-2-2',
            name: 'Bancos de Dados',
            level: 1,
            progress: 20,
            isExample: true
          }
        ]
      },
      {
        id: 'example-3',
        name: 'DevOps',
        level: 1,
        progress: 10,
        isExample: true
      }
    ]
  };

  const renderSkill = (skill: Skill, depth: number = 0) => {
    const handleProgressUpdate = (skillId: string, newProgress: number) => {
      // Don't update progress for example skills
      if (skillId.startsWith('example-')) return;
      
      updateSkillProgress(planId, skillId, Math.min(Math.max(newProgress, 0), 100));
    };

    const isExample = 'isExample' in skill;

    return (
      <div key={skill.id} className="space-y-4" style={{ marginLeft: `${depth * 2}rem` }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 rounded-lg p-4"
        >
          {editingId === skill.id ? (
            <div className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600"
                placeholder="Nome da habilidade"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setEditingId(null)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    editSkill(planId, skill.id, { name: formData.name });
                    setEditingId(null);
                    setFormData({ name: '', description: '' });
                  }}
                >
                  Salvar
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {depth > 0 && <ChevronRight className="h-4 w-4 text-gray-500" />}
                  <h4 className="font-medium text-white">{skill.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  {skill.isCustom && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(skill.id);
                          setFormData({ name: skill.name, description: '' });
                        }}
                        className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Pencil className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => deleteSkill(planId, skill.id)}
                        className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Trash className="h-4 w-4 text-red-400" />
                      </button>
                    </>
                  )}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < skill.level 
                            ? 'text-yellow-500 fill-yellow-500' 
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Nível {skill.level}</span>
                  {!isExample && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleProgressUpdate(skill.id, skill.progress - 10)}
                        className="px-2 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                      >
                        -10%
                      </button>
                      <span className="text-sm text-gray-400">{skill.progress}%</span>
                      <button
                        onClick={() => handleProgressUpdate(skill.id, skill.progress + 10)}
                        className="px-2 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                      >
                        +10%
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {!isExample && (
                <button
                  onClick={() => {
                    setSelectedParentId(skill.id);
                    setShowAddForm(true);
                  }}
                  className="mt-4 w-full p-2 rounded-lg border border-dashed border-gray-700 hover:border-blue-500 hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2 text-gray-400 hover:text-blue-500"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Sub-habilidade
                </button>
              )}
            </>
          )}
        </motion.div>

        {skill.children && skill.children.length > 0 && (
          <div className="space-y-4">
            {skill.children.map(child => renderSkill(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card title="Árvore de Habilidades">
        {!hasCustomSkills ? (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg text-center">
              <Lightbulb className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Crie Sua Própria Árvore de Habilidades</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Mapeie suas habilidades e acompanhe seu progresso em cada área de desenvolvimento.
              </p>
              <Button
                onClick={() => {
                  setSelectedParentId(skill.id);
                  setShowAddForm(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-cyan-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Minha Primeira Habilidade
              </Button>
            </div>

            {/* Add New Skill Form */}
            <AnimatePresence>
              {showAddForm && selectedParentId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
                >
                  <h4 className="text-lg font-medium text-white mb-4">Nova Habilidade</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nome da Habilidade
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Ex: JavaScript Avançado"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setShowAddForm(false);
                          setSelectedParentId(null);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAddSkill}
                        disabled={!formData.name}
                        className="bg-gradient-to-r from-purple-600 to-cyan-600"
                      >
                        Criar Habilidade
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-gray-700 pt-6">
              <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
                Exemplo de Árvore de Habilidades
              </h4>
              <p className="text-gray-400 mb-6">
                Veja como você pode organizar suas habilidades em uma estrutura hierárquica para visualizar melhor seu desenvolvimento.
              </p>
              {renderSkill(exampleSkillTree)}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {renderSkill(skill)}

            {/* Add New Skill Form */}
            {showAddForm && selectedParentId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-gray-800/50 rounded-lg p-4 space-y-4"
              >
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600"
                  placeholder="Nome da habilidade"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowAddForm(false);
                      setSelectedParentId(null);
                      setFormData({ name: '', description: '' });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedParentId && formData.name) {
                        addCustomSkill(planId, selectedParentId, {
                          name: formData.name,
                          children: []
                        });
                        setShowAddForm(false);
                        setSelectedParentId(null);
                        setFormData({ name: '', description: '' });
                      }
                    }}
                  >
                    Adicionar
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
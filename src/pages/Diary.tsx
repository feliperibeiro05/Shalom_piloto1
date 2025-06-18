import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, Calendar, Search, Tag, Save,
  Edit2, Trash2, Plus, X, Music,
  Heart, Brain, Smile, Frown, Meh,
  Sun, Moon, Cloud, Star, Filter, Download, Upload
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSophia } from '../contexts/SophiaContext';
import { useDiary } from '../contexts/DiaryContext';

export const Diary: React.FC = () => {
  const { sendMessage } = useSophia();
  const { 
    entries, 
    templates, 
    stats, 
    addEntry, 
    updateEntry, 
    deleteEntry,
    getEntriesByDate,
    searchEntries,
    exportEntries,
    importEntries
  } = useDiary();
  
  const [currentEntry, setCurrentEntry] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customTag, setCustomTag] = useState('');
  const [filterMood, setFilterMood] = useState<string | null>(null);

  const moods = [
    { icon: Sun, label: 'Feliz', color: 'text-yellow-500' },
    { icon: Cloud, label: 'Tranquilo', color: 'text-blue-500' },
    { icon: Star, label: 'Inspirado', color: 'text-purple-500' },
    { icon: Moon, label: 'Cansado', color: 'text-gray-500' },
    { icon: Heart, label: 'Grato', color: 'text-red-500' },
    { icon: Brain, label: 'Reflexivo', color: 'text-green-500' }
  ];

  const commonTags = [
    'Trabalho', 'Família', 'Saúde', 'Relacionamentos',
    'Objetivos', 'Gratidão', 'Desafios', 'Conquistas',
    'Aprendizados', 'Ideias', 'Sonhos', 'Medos'
  ];

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        const promptText = template.prompts.join('\n\n');
        setCurrentEntry(promptText);
      }
    }
  }, [selectedTemplate, templates]);

  const handleSave = async () => {
    if (!currentEntry.trim()) return;

    if (editingId) {
      await updateEntry(editingId, {
        content: currentEntry,
        date: selectedDate,
        mood: selectedMood,
        tags: selectedTags
      });
      setEditingId(null);
    } else {
      await addEntry({
        content: currentEntry,
        date: selectedDate,
        mood: selectedMood,
        tags: selectedTags,
        isPrivate: true
      });
    }

    // Get AI insights
    sendMessage(`Analisar entrada do diário: ${currentEntry}`);

    setCurrentEntry('');
    setSelectedMood('');
    setSelectedTags([]);
    setSelectedTemplate(null);
  };

  const handleEdit = (entry: any) => {
    setCurrentEntry(entry.content);
    setSelectedDate(entry.date);
    setSelectedMood(entry.mood || '');
    setSelectedTags(entry.tags);
    setEditingId(entry.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta entrada?')) {
      deleteEntry(id);
    }
  };

  const handleAddTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleExport = () => {
    const data = exportEntries();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diario-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result as string;
          await importEntries(data);
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Erro ao importar dados. Verifique o formato do arquivo.');
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredEntries = searchTerm 
    ? searchEntries(searchTerm) 
    : filterMood
      ? entries.filter(entry => entry.mood === filterMood)
      : entries;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Diário Pessoal</h1>
          <p className="text-gray-400">Registre seus pensamentos e reflexões</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar entradas..."
              className="pl-10 pr-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Exportar diário"
            >
              <Download className="h-5 w-5" />
            </button>
            <label className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer" title="Importar diário">
              <Upload className="h-5 w-5" />
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor */}
        <div className="lg:col-span-8">
          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                />
                <Button
                  onClick={() => setShowTagSelector(!showTagSelector)}
                  variant="secondary"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Tags
                </Button>
                <Button
                  onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                  variant="secondary"
                >
                  <Book className="h-4 w-4 mr-2" />
                  Templates
                </Button>
              </div>

              {/* Mood Selector */}
              <div className="flex flex-wrap gap-2">
                {moods.map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    onClick={() => setSelectedMood(label)}
                    className={`px-3 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
                      selectedMood === label
                        ? 'bg-gray-700 border-blue-500'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="text-sm text-gray-300">{label}</span>
                  </button>
                ))}
              </div>

              {/* Tag Selector */}
              <AnimatePresence>
                {showTagSelector && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Tags Comuns</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {commonTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTags(prev => 
                              prev.includes(tag)
                                ? prev.filter(t => t !== tag)
                                : [...prev, tag]
                            )}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                              selectedTags.includes(tag)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customTag}
                          onChange={(e) => setCustomTag(e.target.value)}
                          placeholder="Adicionar tag personalizada..."
                          className="flex-1 px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <Button
                          onClick={handleAddTag}
                          disabled={!customTag.trim()}
                          variant="secondary"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Template Selector */}
              <AnimatePresence>
                {showTemplateSelector && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Templates</h4>
                      <div className="space-y-2">
                        {templates.map(template => (
                          <button
                            key={template.id}
                            onClick={() => {
                              setSelectedTemplate(template.id);
                              setShowTemplateSelector(false);
                            }}
                            className="w-full p-3 text-left rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                          >
                            <h5 className="font-medium text-white">{template.name}</h5>
                            <p className="text-xs text-gray-400 mt-1">
                              {template.prompts[0]}...
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <div 
                      key={tag}
                      className="px-3 py-1 rounded-full bg-blue-500 text-white text-sm flex items-center gap-1"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                        className="hover:text-gray-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Editor */}
              <textarea
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                placeholder="Comece a escrever..."
                className="w-full h-64 px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              />

              <div className="flex justify-end gap-3">
                {editingId && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingId(null);
                      setCurrentEntry('');
                      setSelectedMood('');
                      setSelectedTags([]);
                    }}
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={!currentEntry.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Atualizar' : 'Salvar'}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Stats */}
          <Card title="Estatísticas">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">{stats.totalEntries}</div>
                  <div className="text-sm text-gray-400">Entradas</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
                  <div className="text-sm text-gray-400">Dias seguidos</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">{stats.totalWords}</div>
                  <div className="text-sm text-gray-400">Palavras</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-white">{stats.longestStreak}</div>
                  <div className="text-sm text-gray-400">Recorde</div>
                </div>
              </div>
              
              {stats.mostUsedTags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Tags Mais Usadas</h4>
                  <div className="flex flex-wrap gap-2">
                    {stats.mostUsedTags.slice(0, 5).map(({ tag, count }) => (
                      <div 
                        key={tag}
                        className="px-2 py-1 rounded-full bg-gray-700 text-xs text-gray-300 flex items-center gap-1"
                      >
                        <span>{tag}</span>
                        <span className="text-gray-400">({count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* AI Insights */}
          <Card title="Insights da Sophia">
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <Brain className="h-5 w-5" />
                  <span className="font-medium">Análise de Humor</span>
                </div>
                <p className="text-sm text-gray-300">
                  {stats.moodDistribution.length > 0 
                    ? `Seu humor predominante é "${stats.moodDistribution[0]?.mood}". Isso reflete seu estado emocional atual.`
                    : 'Registre mais entradas para obter análises de humor personalizadas.'}
                </p>
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-purple-500 mb-2">
                  <Star className="h-5 w-5" />
                  <span className="font-medium">Sugestão</span>
                </div>
                <p className="text-sm text-gray-300">
                  {stats.currentStreak > 0
                    ? `Você está escrevendo há ${stats.currentStreak} dias seguidos. Continue assim!`
                    : 'Que tal dedicar um momento para refletir sobre suas conquistas da semana?'}
                </p>
              </div>
            </div>
          </Card>

          {/* Music Recommendation */}
          <Card title="Música Recomendada">
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <Music className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium text-white">Momento de Calma</h4>
                  <p className="text-sm text-gray-400">Playlist relaxante para reflexão</p>
                </div>
              </div>
              <Button className="w-full">
                Ouvir Agora
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Entry History */}
      <Card title="Histórico de Entradas">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterMood || ''}
              onChange={(e) => setFilterMood(e.target.value || null)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="">Todos os humores</option>
              {moods.map(mood => (
                <option key={mood.label} value={mood.label}>{mood.label}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-400">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entrada' : 'entradas'}
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma entrada encontrada</p>
            </div>
          ) : (
            filteredEntries.map(entry => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-300">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    {entry.mood && (
                      <span className="text-sm px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                        {entry.mood}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-200 mb-3 whitespace-pre-wrap">
                  {entry.content.length > 200 
                    ? `${entry.content.substring(0, 200)}...` 
                    : entry.content}
                </p>

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-gray-700 text-sm text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
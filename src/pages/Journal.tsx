import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, Search, Filter, Bookmark, 
  Share2, ThumbsUp, MessageSquare, Eye,
  EyeOff, Star, TrendingUp, Brain, Heart,
  Coffee, Book, DollarSign, Smile, X, Plus
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSophia } from '../contexts/SophiaContext';

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  image: string;
  readTime: number;
  publishedAt: string;
  author: string;
  likes: number;
  comments: number;
  isRead: boolean;
  isBookmarked: boolean;
}

export const Journal: React.FC = () => {
  const { userState } = useSophia();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState<string | null>(null);

  const categories = [
    { id: 'finance', icon: DollarSign, label: 'Finanças' },
    { id: 'mental-health', icon: Brain, label: 'Saúde Mental' },
    { id: 'personal-dev', icon: TrendingUp, label: 'Desenvolvimento Pessoal' },
    { id: 'behavior', icon: Smile, label: 'Comportamento' },
    { id: 'minimalism', icon: Coffee, label: 'Minimalismo' },
    { id: 'productivity', icon: Star, label: 'Produtividade' }
  ];

  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      title: 'Como Desenvolver uma Mentalidade de Crescimento',
      summary: 'Descubra as estratégias práticas para cultivar uma mentalidade voltada ao crescimento contínuo e aprendizado.',
      category: 'personal-dev',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643',
      readTime: 5,
      publishedAt: new Date().toISOString(),
      author: 'Ana Silva',
      likes: 124,
      comments: 18,
      isRead: false,
      isBookmarked: true
    },
    {
      id: '2',
      title: 'Técnicas de Produtividade para o Dia a Dia',
      summary: 'Aprenda métodos comprovados para aumentar sua produtividade e alcançar mais resultados em menos tempo.',
      category: 'productivity',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b',
      readTime: 7,
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      author: 'Carlos Santos',
      likes: 89,
      comments: 12,
      isRead: true,
      isBookmarked: false
    },
    {
      id: '3',
      title: 'Finanças Pessoais: Por Onde Começar',
      summary: 'Um guia completo para organizar suas finanças e começar a investir, mesmo com pouco dinheiro.',
      category: 'finance',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e',
      readTime: 8,
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      author: 'Roberto Alves',
      likes: 156,
      comments: 23,
      isRead: false,
      isBookmarked: false
    },
    {
      id: '4',
      title: 'Mindfulness: Práticas para Reduzir a Ansiedade',
      summary: 'Técnicas de mindfulness que podem ajudar a reduzir a ansiedade e melhorar seu bem-estar mental.',
      category: 'mental-health',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      readTime: 6,
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      author: 'Juliana Costa',
      likes: 210,
      comments: 34,
      isRead: false,
      isBookmarked: false
    }
  ]);

  const handleToggleBookmark = (articleId: string) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, isBookmarked: !article.isBookmarked }
        : article
    ));
  };

  const handleToggleRead = (articleId: string) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, isRead: !article.isRead }
        : article
    ));
  };

  const handleLike = (articleId: string) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { ...article, likes: article.likes + 1 }
        : article
    ));
  };

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReadFilter = !showUnreadOnly || !article.isRead;
    return matchesCategory && matchesSearch && matchesReadFilter;
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || Book;
  };

  const getArticleContent = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return '';

    return `
      <h1>${article.title}</h1>
      <p class="author">Por ${article.author}</p>
      
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
      
      <h2>Principais pontos</h2>
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
      
      <ul>
        <li>Ponto importante sobre ${article.title}</li>
        <li>Outro ponto relevante para o tema</li>
        <li>Consideração final sobre o assunto</li>
      </ul>
      
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
      
      <h2>Conclusão</h2>
      <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.</p>
    `;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Journal</h1>
          <p className="text-gray-400">Conteúdo personalizado para seu desenvolvimento</p>
        </div>
        <Button
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          variant="secondary"
          className="flex items-center gap-2"
        >
          {showUnreadOnly ? (
            <>
              <Eye className="h-4 w-4" />
              Mostrar Todos
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4" />
              Apenas Não Lidos
            </>
          )}
        </Button>
      </div>

      {/* Quote of the Day */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Star className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Frase do Dia</h3>
            <p className="text-gray-300 italic">
              "A única maneira de fazer um excelente trabalho é amar o que você faz."
            </p>
            <p className="text-sm text-gray-400 mt-2">- Steve Jobs</p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar artigos..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">Todas categorias</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => {
            const CategoryIcon = getCategoryIcon(article.category);
            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700"
              >
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      onClick={() => handleToggleBookmark(article.id)}
                      className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
                        article.isBookmarked
                          ? 'bg-blue-500/20 text-blue-500'
                          : 'bg-gray-900/20 text-gray-300 hover:text-white'
                      }`}
                    >
                      <Bookmark className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleToggleRead(article.id)}
                      className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
                        article.isRead
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-gray-900/20 text-gray-300 hover:text-white'
                      }`}
                    >
                      {article.isRead ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CategoryIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-400">
                      {categories.find(c => c.id === article.category)?.label}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-sm text-gray-400">
                      {article.readTime} min leitura
                    </span>
                  </div>

                  <h3 className="text-xl font-medium text-white mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {article.summary}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleLike(article.id)}
                        className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{article.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        <span>{article.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                    <Button onClick={() => setShowArticleModal(article.id)}>
                      Ler Mais
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <Newspaper className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm 
                ? `Não encontramos artigos para "${searchTerm}"`
                : 'Não há artigos disponíveis para os filtros selecionados'}
            </p>
            {searchTerm && (
              <Button onClick={() => setSearchTerm('')}>
                Limpar Busca
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {showArticleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  {articles.find(a => a.id === showArticleModal)?.title}
                </h2>
                <button
                  onClick={() => setShowArticleModal(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: getArticleContent(showArticleModal) }}
                />
              </div>
              
              <div className="p-6 border-t border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <ThumbsUp className="h-5 w-5" />
                    <span>Curtir</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <Share2 className="h-5 w-5" />
                    <span>Compartilhar</span>
                  </button>
                  <button 
                    onClick={() => {
                      handleToggleBookmark(showArticleModal);
                      handleToggleRead(showArticleModal);
                    }}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Bookmark className="h-5 w-5" />
                    <span>Salvar</span>
                  </button>
                </div>
                <Button onClick={() => setShowArticleModal(null)}>
                  Fechar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
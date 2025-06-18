import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MessageSquare, Heart, Share2, Filter,
  Plus, Image as ImageIcon, Smile, Send, X,
  TrendingUp, Award, User, Settings, Search,
  ThumbsUp, MessageCircle, Gift, Flag
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCommunity } from '../contexts/CommunityContext';

export const Community: React.FC = () => {
  const { 
    posts, 
    groups, 
    userProfile,
    addPost,
    likePost,
    addComment,
    joinGroup,
    getPostsByCategory,
    searchPosts
  } = useCommunity();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newPost, setNewPost] = useState({
    content: '',
    category: 'inspiration' as 'achievement' | 'question' | 'inspiration' | 'support',
    image: '',
    tags: [] as string[]
  });

  const handleLike = (postId: string) => {
    likePost(postId);
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    
    addComment(postId, {
      userId: userProfile.id,
      userName: userProfile.name,
      userAvatar: userProfile.avatar,
      content: commentText
    });
    
    setCommentText('');
    setShowCommentForm(null);
  };

  const handleSubmitPost = () => {
    if (!newPost.content.trim()) return;

    addPost({
      userId: userProfile.id,
      userName: userProfile.name,
      userAvatar: userProfile.avatar,
      content: newPost.content,
      category: newPost.category,
      image: newPost.image || undefined,
      userLevel: userProfile.level,
      tags: newPost.tags
    });

    setNewPost({
      content: '',
      category: 'inspiration',
      image: '',
      tags: []
    });
    setShowNewPostModal(false);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      achievement: 'text-green-500',
      question: 'text-blue-500',
      inspiration: 'text-purple-500',
      support: 'text-yellow-500'
    };
    return colors[category as keyof typeof colors] || 'text-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      achievement: Award,
      question: MessageCircle,
      inspiration: Smile,
      support: Heart
    };
    return icons[category as keyof typeof icons] || MessageSquare;
  };

  const filteredPosts = searchTerm 
    ? searchPosts(searchTerm)
    : selectedCategory 
      ? getPostsByCategory(selectedCategory as any)
      : posts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Comunidade</h1>
          <p className="text-gray-400">Conecte-se, compartilhe e cresça junto</p>
        </div>
        <Button
          onClick={() => setShowNewPostModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Publicação
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Filters */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar publicações..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">Todas categorias</option>
                  <option value="achievement">Conquistas</option>
                  <option value="question">Perguntas</option>
                  <option value="inspiration">Inspiração</option>
                  <option value="support">Apoio</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.userAvatar}
                        alt={post.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{post.userName}</span>
                          <span className="text-sm text-gray-400">Nível {post.userLevel}</span>
                          {post.userMood && (
                            <span className="text-sm text-gray-400">• {post.userMood}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>{new Date(post.timestamp).toLocaleString()}</span>
                          {post.category && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                {React.createElement(getCategoryIcon(post.category), {
                                  className: `h-4 w-4 ${getCategoryColor(post.category)}`
                                })}
                                <span className="capitalize">{post.category}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                      <Settings className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-200 mb-4">{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post content"
                      className="rounded-lg mb-4 w-full"
                    />
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 ${
                        post.isLiked ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
                      }`}
                    >
                      <ThumbsUp className="h-5 w-5" />
                      <span>{post.likes}</span>
                    </button>
                    <button 
                      onClick={() => setShowCommentForm(showCommentForm === post.id ? null : post.id)}
                      className="flex items-center gap-2 text-gray-400 hover:text-blue-500"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>{post.comments.length}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500">
                      <Share2 className="h-5 w-5" />
                      <span>Compartilhar</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-red-500">
                      <Flag className="h-5 w-5" />
                      <span>Reportar</span>
                    </button>
                  </div>

                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-3">
                          <img
                            src={comment.userAvatar}
                            alt={comment.userName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 bg-gray-700/50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-white">{comment.userName}</span>
                              <span className="text-xs text-gray-400">
                                {new Date(comment.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Form */}
                  {showCommentForm === post.id && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex items-start gap-3">
                        <img
                          src={userProfile.avatar}
                          alt={userProfile.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Escreva um comentário..."
                            className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                            rows={2}
                          />
                          <div className="flex justify-end mt-2">
                            <Button
                              onClick={() => handleAddComment(post.id)}
                              disabled={!commentText.trim()}
                              size="sm"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Comentar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  Nenhuma publicação encontrada
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm 
                    ? `Não encontramos publicações para "${searchTerm}"`
                    : selectedCategory
                      ? 'Não há publicações nesta categoria'
                      : 'Seja o primeiro a compartilhar algo com a comunidade!'}
                </p>
                {searchTerm && (
                  <Button onClick={() => setSearchTerm('')}>
                    Limpar Busca
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* User Stats */}
          <Card>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <img 
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{userProfile.name}</h3>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <span>Nível {userProfile.level}</span>
                <span>•</span>
                <span>{userProfile.points} pontos</span>
              </div>
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Próximo nível</span>
                  <span className="text-white">75%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                </div>
              </div>
            </div>
          </Card>

          {/* Groups */}
          <Card title="Grupos Populares">
            <div className="space-y-4">
              {groups.map(group => (
                <div
                  key={group.id}
                  className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{group.name}</h4>
                    <p className="text-sm text-gray-400 truncate">{group.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{group.members} membros</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant={group.isJoined ? "secondary" : "primary"}
                        onClick={() => joinGroup(group.id)}
                      >
                        {group.isJoined ? 'Participando' : 'Participar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Trending Topics */}
          <Card title="Tópicos em Alta">
            <div className="space-y-3">
              {[
                { tag: '#Meditação', posts: 128 },
                { tag: '#DesenvolvimentoPessoal', posts: 96 },
                { tag: '#BemEstar', posts: 84 },
                { tag: '#Produtividade', posts: 72 }
              ].map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-white">{topic.tag}</span>
                  </div>
                  <span className="text-sm text-gray-400">{topic.posts} posts</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card title="Conquistas Recentes">
            <div className="space-y-3">
              {userProfile.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
                >
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="text-white">{achievement}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPostModal && (
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
              className="bg-gray-800 rounded-xl p-6 w-full max-w-xl relative"
            >
              <button
                onClick={() => setShowNewPostModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-semibold text-white mb-6">Nova Publicação</h2>

              <div className="space-y-4">
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="O que você quer compartilhar?"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  rows={4}
                />

                <div className="flex items-center gap-4">
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ 
                      ...prev, 
                      category: e.target.value as any
                    }))}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="achievement">Conquista</option>
                    <option value="question">Pergunta</option>
                    <option value="inspiration">Inspiração</option>
                    <option value="support">Apoio</option>
                  </select>

                  <button
                    onClick={() => setNewPost(prev => ({ 
                      ...prev, 
                      image: prev.image ? '' : 'https://source.unsplash.com/random/800x600/?nature' 
                    }))}
                    className={`p-2 rounded-lg transition-colors ${
                      newPost.image ? 'bg-blue-500/20 text-blue-500' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="h-5 w-5" />
                  </button>

                  <button
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                </div>

                {/* Tags Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: desenvolvimento, produtividade"
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white"
                    value={newPost.tags.join(', ')}
                    onChange={(e) => setNewPost(prev => ({
                      ...prev,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }))}
                  />
                </div>

                {newPost.image && (
                  <div className="relative">
                    <img 
                      src={newPost.image} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setNewPost(prev => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 p-1 bg-gray-900/80 rounded-full text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setShowNewPostModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmitPost}
                    disabled={!newPost.content.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Publicar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
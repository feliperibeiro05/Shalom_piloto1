import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Star, Gift, Zap, Crown, Target,
  ShoppingBag, Coins, Plus, ChevronRight,
  ArrowRight, CheckCircle, Lock, X
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useRewards } from '../contexts/RewardsContext';

export const Rewards: React.FC = () => {
  const { 
    achievements, 
    storeItems, 
    userProfile, 
    updateAchievementProgress,
    purchaseItem,
    equipItem,
    addExperience,
    addPoints
  } = useRewards();
  
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'daily' | 'weekly' | 'monthly' | 'special'>('daily');
  const [showPurchaseConfirm, setShowPurchaseConfirm] = useState<string | null>(null);

  // Simulate achievement progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomAchievement = achievements.find(a => !a.completed);
      if (randomAchievement) {
        const newProgress = Math.min(randomAchievement.progress + 1, randomAchievement.total);
        updateAchievementProgress(randomAchievement.id, newProgress);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [achievements, updateAchievementProgress]);

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-gray-400',
      rare: 'text-blue-500',
      epic: 'text-purple-500',
      legendary: 'text-yellow-500'
    };
    return colors[rarity as keyof typeof colors] || 'text-gray-400';
  };

  const getRarityBorder = (rarity: string) => {
    const colors = {
      common: 'border-gray-400',
      rare: 'border-blue-500',
      epic: 'border-purple-500',
      legendary: 'border-yellow-500'
    };
    return colors[rarity as keyof typeof colors] || 'border-gray-400';
  };

  const handlePurchase = (itemId: string) => {
    const item = storeItems.find(i => i.id === itemId);
    if (!item || item.owned || userProfile.points < item.price) return;

    purchaseItem(itemId);
    setShowPurchaseConfirm(null);
  };

  const handleEquipItem = (itemId: string) => {
    equipItem(itemId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Recompensas</h1>
          <p className="text-gray-400">Acompanhe suas conquistas e desbloqueie itens especiais</p>
        </div>
        <Button
          onClick={() => setShowStoreModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Loja de Recompensas
        </Button>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Trophy className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Nível {userProfile.level}</h3>
              <p className="text-sm text-gray-400">{userProfile.title}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Coins className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">{userProfile.points} pontos</h3>
              <p className="text-sm text-gray-400">Moeda da plataforma</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Target className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">75% completo</h3>
              <p className="text-sm text-gray-400">Progresso do nível</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Progresso do Nível</h3>
            <span className="text-sm text-gray-400">{userProfile.experience}/1000 XP</span>
          </div>
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(userProfile.experience % 1000) / 10}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Nível {userProfile.level}</span>
            <span className="text-gray-400">Nível {userProfile.level + 1}</span>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card title="Conquistas">
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex items-center gap-2 border-b border-gray-700">
            {(['daily', 'weekly', 'monthly', 'special'] as const).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Achievement List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements
              .filter(a => a.category === selectedCategory)
              .map(achievement => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border ${
                    achievement.completed
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-gray-800/50 border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      achievement.completed ? 'bg-green-500/20' : 'bg-gray-700'
                    }`}>
                      {achievement.icon === '🎯' && <Target className={`h-6 w-6 ${
                        achievement.completed ? 'text-green-500' : getRarityColor(achievement.rarity)
                      }`} />}
                      {achievement.icon === '🏆' && <Trophy className={`h-6 w-6 ${
                        achievement.completed ? 'text-green-500' : getRarityColor(achievement.rarity)
                      }`} />}
                      {achievement.icon === '🧘' && <Zap className={`h-6 w-6 ${
                        achievement.completed ? 'text-green-500' : getRarityColor(achievement.rarity)
                      }`} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{achievement.title}</h4>
                        <span className={`text-sm ${getRarityColor(achievement.rarity)}`}>
                          {achievement.points} pts
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">
                            {achievement.progress}/{achievement.total}
                          </span>
                          <span className="text-gray-400">
                            {Math.round((achievement.progress / achievement.total) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                            className={`h-full rounded-full ${
                              achievement.completed
                                ? 'bg-green-500'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </Card>

      {/* Store Modal */}
      <AnimatePresence>
        {showStoreModal && (
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
              className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative"
            >
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-6 w-6 text-purple-500" />
                    <h2 className="text-xl font-semibold text-white">Loja de Recompensas</h2>
                  </div>
                  <button
                    onClick={() => setShowStoreModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="text-white font-medium">{userProfile.points} pontos disponíveis</span>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {storeItems.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-gray-800/50 rounded-lg border ${getRarityBorder(item.rarity)}`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-white">{item.name}</h3>
                          <span className={`text-sm ${getRarityColor(item.rarity)}`}>
                            {item.rarity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coins className="h-4 w-4 text-yellow-500" />
                            <span className="text-white">{item.price}</span>
                          </div>
                          {item.owned ? (
                            <Button
                              variant="secondary"
                              className="flex items-center gap-2"
                              onClick={() => handleEquipItem(item.id)}
                            >
                              {item.equipped ? (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  Equipado
                                </>
                              ) : (
                                'Equipar'
                              )}
                            </Button>
                          ) : (
                            <Button
                              disabled={userProfile.points < item.price}
                              onClick={() => setShowPurchaseConfirm(item.id)}
                              className={userProfile.points >= item.price
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                                : ''
                              }
                            >
                              {userProfile.points >= item.price ? (
                                <>
                                  <ShoppingBag className="h-4 w-4 mr-2" />
                                  Comprar
                                </>
                              ) : (
                                <>
                                  <Lock className="h-4 w-4 mr-2" />
                                  Bloqueado
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purchase Confirmation Modal */}
      <AnimatePresence>
        {showPurchaseConfirm && (
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
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Confirmar Compra</h3>
              <p className="text-gray-400 mb-6">
                Tem certeza que deseja comprar este item? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowPurchaseConfirm(null)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handlePurchase(showPurchaseConfirm)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Confirmar Compra
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
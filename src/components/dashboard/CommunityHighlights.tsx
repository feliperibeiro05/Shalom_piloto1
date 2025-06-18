import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronRight, Award, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCommunity } from '../../contexts/CommunityContext';

export const CommunityHighlights: React.FC = () => {
  const { posts } = useCommunity();
  
  // Get recent popular posts
  const highlights = posts
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 2)
    .map(post => ({
      user: post.userName,
      achievement: post.content.length > 50 ? post.content.substring(0, 50) + '...' : post.content,
      time: getTimeAgo(new Date(post.timestamp)),
      avatar: post.userAvatar
    }));

  function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'a atrás';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'm atrás';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd atrás';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h atrás';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'min atrás';
    
    return Math.floor(seconds) + 's atrás';
  }

  return (
    <Card title="Destaques da Comunidade">
      <div className="space-y-4">
        {highlights.length > 0 ? (
          highlights.map((highlight, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg"
            >
              <img 
                src={highlight.avatar} 
                alt={highlight.user} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-white font-medium">{highlight.user}</p>
                <p className="text-sm text-gray-400">{highlight.achievement}</p>
                <p className="text-xs text-gray-500 mt-1">{highlight.time}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-4">
            <Users className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">Nenhuma atividade recente</p>
          </div>
        )}
        
        <Button 
          className="w-full mt-4 flex items-center justify-center gap-1"
          variant="secondary"
        >
          Ver Comunidade
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
import React from 'react';
import { Card } from '../ui/Card';
import { Smile, Meh, Frown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useEmotional } from '../../contexts/EmotionalContext';
import { useNavigate } from 'react-router-dom';

export const MoodWidget: React.FC = () => {
  const { getWellbeingScore, emotions } = useEmotional();
  const navigate = useNavigate();
  
  const wellbeingScore = getWellbeingScore();
  const recentEmotions = emotions.slice(0, 3);
  
  const getMoodIcon = () => {
    if (wellbeingScore > 70) return <Smile className="h-8 w-8 text-green-500" />;
    if (wellbeingScore > 40) return <Meh className="h-8 w-8 text-yellow-500" />;
    return <Frown className="h-8 w-8 text-red-500" />;
  };
  
  const getMoodText = () => {
    if (wellbeingScore > 70) return 'Você está mais produtivo que o normal!';
    if (wellbeingScore > 40) return 'Seu humor está equilibrado hoje.';
    return 'Você parece estar com energia baixa hoje.';
  };

  return (
    <Card title="Seu Humor Hoje">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {getMoodIcon()}
          <div>
            <h3 className="font-medium text-white">
              {wellbeingScore > 70 ? 'Excelente!' : 
               wellbeingScore > 40 ? 'Equilibrado' : 'Energia Baixa'}
            </h3>
            <p className="text-sm text-gray-400">{getMoodText()}</p>
          </div>
        </div>
        
        {recentEmotions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Emoções Recentes</h4>
            <div className="space-y-2">
              {recentEmotions.map((emotion, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 capitalize">{emotion.emotion}</span>
                  <span className="text-white">
                    {new Date(emotion.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Button 
          onClick={() => navigate('/dashboard/emotional')}
          className="w-full flex items-center justify-center gap-1"
          variant="secondary"
        >
          Registrar Humor
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
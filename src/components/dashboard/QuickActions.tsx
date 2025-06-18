import React from 'react';
import { Plus, BarChart2, Heart, Brain, PiggyBank, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  const actions = [
    { 
      icon: Plus, 
      label: 'Nova Atividade', 
      color: 'text-blue-500',
      onClick: () => navigate('/dashboard/activities')
    },
    { 
      icon: PiggyBank, 
      label: 'Registrar Finanças', 
      color: 'text-green-500',
      onClick: () => navigate('/dashboard/financial')
    },
    { 
      icon: Heart, 
      label: 'Registrar Saúde', 
      color: 'text-red-500',
      onClick: () => navigate('/dashboard/health')
    },
    { 
      icon: Brain, 
      label: 'Registrar Humor', 
      color: 'text-purple-500',
      onClick: () => navigate('/dashboard/emotional')
    },
    { 
      icon: BookOpen, 
      label: 'Escrever Diário', 
      color: 'text-cyan-500',
      onClick: () => navigate('/dashboard/diary')
    },
    { 
      icon: BarChart2, 
      label: 'Ver Progresso', 
      color: 'text-yellow-500',
      onClick: () => navigate('/dashboard/activities')
    }
  ];

  return (
    <Card title="Ações Rápidas">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <Button 
            key={index}
            variant="secondary" 
            className="flex flex-col items-center py-4 h-auto"
            onClick={action.onClick}
          >
            <action.icon className={`h-5 w-5 mb-1 ${action.color}`} />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};
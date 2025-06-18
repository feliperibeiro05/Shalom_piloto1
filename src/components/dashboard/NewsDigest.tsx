import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export const NewsDigest: React.FC = () => {
  const news = [
    {
      title: "Novos estudos sobre produtividade",
      category: "Desenvolvimento",
      time: "1h atrás",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&q=80"
    },
    {
      title: "Tendências de investimentos 2024",
      category: "Finanças",
      time: "3h atrás",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&q=80"
    },
    {
      title: "5 técnicas para melhorar o foco",
      category: "Produtividade",
      time: "1d atrás",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=80&q=80"
    }
  ];

  return (
    <Card title="Artigos Recomendados">
      <div className="space-y-4">
        {news.map((item, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-white group-hover:text-blue-400 transition-colors">
                {item.title}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-500">{item.category}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">{item.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
        
        <Button 
          className="w-full mt-4 flex items-center justify-center gap-1"
          variant="secondary"
        >
          Ver Todos Artigos
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
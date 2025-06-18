import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronRight, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

export const InvestmentChart: React.FC = () => {
  // Sample data
  const investmentData = [
    { category: 'Renda Fixa', percentage: 40, color: 'bg-blue-500' },
    { category: 'Renda Variável', percentage: 30, color: 'bg-green-500' },
    { category: 'Internacional', percentage: 20, color: 'bg-purple-500' },
    { category: 'Criptomoedas', percentage: 10, color: 'bg-yellow-500' }
  ];

  return (
    <Card title="Carteira de Investimentos">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Total Investido</span>
          <span className="text-2xl font-bold text-green-500">R$ 25.430,00</span>
        </div>
        
        <div className="flex items-center justify-center py-4">
          <div className="relative w-32 h-32">
            {investmentData.map((item, index) => {
              const startAngle = investmentData
                .slice(0, index)
                .reduce((sum, curr) => sum + curr.percentage, 0) * 3.6;
              
              return (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className={`absolute inset-0 ${item.color}`}
                  style={{
                    clipPath: `conic-gradient(from ${startAngle}deg, currentColor ${item.percentage * 3.6}deg, transparent 0deg)`
                  }}
                />
              );
            })}
            <div className="absolute inset-[15%] bg-gray-800 rounded-full flex items-center justify-center">
              <PieChart className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          {investmentData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-gray-300">{item.category}</span>
              </div>
              <span className="text-white">{item.percentage}%</span>
            </div>
          ))}
        </div>

        <Button 
          className="w-full mt-4 flex items-center justify-center gap-1"
          variant="secondary"
        >
          Ver Carteira Completa
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
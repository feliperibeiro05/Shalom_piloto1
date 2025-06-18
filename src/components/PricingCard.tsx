import React from 'react';
import { Check } from 'lucide-react';
import { Button } from './ui/Button';

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  features,
  isPopular = false,
}) => {
  return (
    <div className={`
      relative p-8 rounded-2xl border transition-all duration-300
      ${isPopular 
        ? 'border-blue-500 bg-gradient-to-b from-blue-900/20 to-purple-900/20 scale-105' 
        : 'border-gray-700 hover:border-blue-500/50'}
    `}>
      {isPopular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 rounded-full text-sm font-medium">
          Mais Popular
        </span>
      )}
      <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        {title}
      </h3>
      <div className="mt-4 mb-8">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-400">/mês</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="h-5 w-5 text-blue-500" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        className={`w-full ${isPopular ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}`}
        variant={isPopular ? 'primary' : 'outline'}
      >
        Começar Agora
      </Button>
    </div>
  );
};
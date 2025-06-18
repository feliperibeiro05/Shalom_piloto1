import React, { useState, useEffect } from 'react';
import { getBrazilDateTime } from '../../utils/date';
import { useAuth } from '../../contexts/AuthContext';
import { useEmotional } from '../../contexts/EmotionalContext';
import { Smile, Meh, Frown } from 'lucide-react';

const motivationalQuotes = [
  { quote: "A mente que se abre a uma nova ideia jamais voltará ao seu tamanho original.", author: "Albert Einstein" },
  { quote: "O único modo de fazer um excelente trabalho é amar o que você faz.", author: "Steve Jobs" },
  { quote: "A jornada de mil milhas começa com um único passo.", author: "Lao Tzu" },
  { quote: "Seja a mudança que você quer ver no mundo.", author: "Mahatma Gandhi" },
  { quote: "O sucesso é ir de fracasso em fracasso sem perder o entusiasmo.", author: "Winston Churchill" }
];

export const WelcomeMessage: React.FC = () => {
  const { user } = useAuth();
  const { getWellbeingScore } = useEmotional();
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const [currentDate, setCurrentDate] = useState(getBrazilDateTime());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentDate(getBrazilDateTime());
    }, 60000);

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Bom dia');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }

    return () => clearInterval(interval);
  }, []);

  const firstName = user?.user_metadata?.first_name || 'Usuário';
  const wellbeingScore = getWellbeingScore();

  const getMoodIcon = () => {
    if (wellbeingScore > 70) return <Smile className="h-6 w-6 text-green-500" />;
    if (wellbeingScore > 40) return <Meh className="h-6 w-6 text-yellow-500" />;
    return <Frown className="h-6 w-6 text-red-500" />;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {getMoodIcon()}
          <h1 className="text-3xl font-bold text-white">
            {greeting}, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{firstName}</span>
          </h1>
        </div>
        <div className="text-right ml-4">
          <p className="text-gray-400 capitalize">{currentDate.dayOfWeek}</p>
          <p className="text-gray-300">{currentDate.formatted}</p>
          <p className="text-gray-400">{currentDate.time}</p>
        </div>
      </div>
      <p className="text-gray-400 italic">"{quote.quote}" - {quote.author}</p>
    </div>
  );
};
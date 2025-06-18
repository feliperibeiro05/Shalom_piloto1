import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const quotes = [
  {
    text: "O segredo para seguir em frente é começar.",
    author: "Mark Twain"
  },
  {
    text: "A produtividade nunca é um acidente. É sempre o resultado de um compromisso com a excelência, planejamento inteligente e esforço focado.",
    author: "Paul J. Meyer"
  },
  {
    text: "Não espere por circunstâncias ideais. Tome as circunstâncias atuais ideais.",
    author: "James Clear"
  }
];

export const MotivationalQuote: React.FC = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="flex items-start gap-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
      <Quote className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
      <div>
        <p className="text-xl text-gray-200 font-medium mb-2">
          {quote.text}
        </p>
        <p className="text-sm text-gray-400">
          — {quote.author}
        </p>
      </div>
    </div>
  );
};
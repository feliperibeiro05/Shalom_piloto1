import React from 'react';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  content: string;
  author: string;
  role: string;
  imageUrl: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  content,
  author,
  role,
  imageUrl,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-gray-700">
      <Quote className="h-8 w-8 text-blue-500 mb-4" />
      <p className="text-gray-300 mb-6">{content}</p>
      <div className="flex items-center gap-4">
        <img
          src={imageUrl}
          alt={author}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {author}
          </h4>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
};
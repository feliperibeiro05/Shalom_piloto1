import React from 'react';
import { BrainCog } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { LoginForm } from '../components/auth/LoginForm';

export const Login: React.FC = () => {
  return (
    <>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <BrainCog className="h-12 w-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Bem-vindo de volta
        </h2>
        <p className="text-gray-400 mt-2">
          Continue sua jornada de desenvolvimento
        </p>
      </div>

      <Card className="backdrop-blur-lg bg-gray-800/50 border-gray-700">
        <LoginForm />
      </Card>
    </>
  );
};